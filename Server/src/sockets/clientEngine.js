// Database log and user controller objects
import * as DBUser from '../mongo/userController.js'
import * as DBLog from '../mongo/logController.js'

import { decodeToken, getMySocket } from '../sockets.js'
import { isWizardEnabled } from './wizardEngine.js'
import { isWatsonEnabled, sendWatsonResponse } from './watsonEngine.js'

import { lookupJITStatuses } from './JITStatusHelper.js'
import { EXCLUDED_TOKEN_PROPS } from '../sessionManager.js'

// Helper methods
import * as Analysis from './analysisEngine.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:client-socket-engine')

// Per-element array comparison (non-recursive)
function compareArrays (A, B) {
  // If both are falsy, return true
  if (!A && !B) { return true }

  // If one is falsy (null, undefined, etc.) then return false
  if (!A || !B) { return false }

  // compare lengths - can save a lot of time
  if (A.length !== B.length) { return false }

  // Compare individual elements
  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) { return false }
  }

  // Perfect match
  return true
}

// Setup data for this session
// - 'this' = current socket
export function socketClientSession (clientInfo) {
  // Is there a valid token
  if (!clientInfo.token) {
    debug(`[WS:${this.id}] invalid - client session token missing`)
    return
  }

  // Setup session storage
  const tokenPayload = { ...decodeToken(clientInfo.token) }
  if (this.request.session) {
    // Setup type and userInfo
    this.request.session.sessionType = 'client'
    this.request.session.userInfo = tokenPayload
    EXCLUDED_TOKEN_PROPS.forEach((propKey) => {
      delete this.request.session.userInfo[propKey]
    })

    // Update list of contexts
    if (clientInfo.context !== 'global') {
      if (!Array.isArray(clientInfo.context)) { clientInfo.context = [clientInfo.context] }
      this.request.session.contexts = [...clientInfo.context]
    }

    // Write the session data
    this.request.session.save()
  }

  // Ensure socket rooms are initialized
  if (this.rooms.has('clients')) {
    debug(`[WS:${this.id}] updated client session (${clientInfo.context})`)
  } else {
    debug(`[WS:${this.id}] new client session (${clientInfo.context})`)

    // Connect to general client rooms and email based room
    this.join('clients')
    this.join(tokenPayload.email)

    // Connect to team rooms (note: runs asynchronously)
    DBUser.getUserDetails(tokenPayload.id)
      .then((result) => {
        const teams = result?.teams ? result.teams : []
        teams.forEach((teamID) => {
          this.join(`team-${teamID}`)
        })
      })
      .catch((err) => {
        debug('Error retrieving user team list, can\'t add to team rooms.')
        debug(err)
      })
  }

  // If not a global connect, check timed triggers, broadcast to wizard, and record timestamps
  if (clientInfo.context !== 'global') {
    // Update timed triggers
    Analysis.checkTimedTriggers(tokenPayload)
      .catch((err) => {
        debug('Error checking timed triggers on client session update')
        debug(err)
      })

    // Broadcast to wizard
    // TODO: Update to new session system
    // if (isWizardEnabled()) {
    //   getMySocket().to('wizards').emit('updateSessions', clientSessions)
    // }

    // Record the context connection in user entry in database
    const req = this.request
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    DBUser.updateUserTimestamps(tokenPayload.id, address, clientInfo.context)
      .catch((err) => {
        console.error('WARNING: Failed to update context timestamp')
        console.error(err)
      })
  }
}

// Updated text of message being written
// - 'this' = current socket
export function socketMessageUpdate (message) {
  if (!this.request.session || !this.request.session.userInfo) {
    debug(`[WS:${this.id}] typing message before login`)
    return
  }

  // Update user's list of context aliases (their username in a service like Discord or Teams)
  const userInfo = this.request.session.userInfo
  DBUser.setUserAlias(userInfo.id, message.context, message.aliasId, message.aliasName, message.avatarURL)
    .catch((err) => {
      debug('Alias update failed')
      debug(err)
    })

  // Get local copy of replyStatus (may be undefined)
  const replyStatus = this.request.status.replyStatus

  // Provide any user statuses relevant to the current message
  if (message.data.replyId || Array.isArray(message.data.participants) || Array.isArray(message.data.mentions)) {
    // Is this a duplicate request that was already sent?
    if (message.data.replyId !== replyStatus?.replyId ||
      !compareArrays(message.data.participants, replyStatus?.participants) ||
      !compareArrays(message.data.mentions, replyStatus?.mentions)) {
      // Lookup the statuses
      lookupJITStatuses(message.aliasId, message.data, message.context)
        .then(([replyToStatus, mentionStatus, participantStatus]) => {
          // Only send a status message if it is not empty
          if (replyToStatus.length > 0 || mentionStatus.length > 0 || participantStatus.length > 0) {
            // Remember the most recently sent data (to detect duplicate requests)
            this.request.status.replyStatus = {
              replyId: message.replyId,
              mentions: message.mentions,
              participants: message.participants
            }
            this.request.status.save()

            // Send the latest status info
            sendStatusMessage(this, message.context, userInfo.email, replyToStatus, mentionStatus, participantStatus)
          }
        })
    }
  }

  if (isWatsonEnabled()) {
    debug(`[WS:${this.id}] draft message sent to watson from ${message.context}`)
    // Hook to intelligence core, expect a promise in return
    Analysis.analyzeMessage(message.data, userInfo.id, message.context, false)
      .then((result) => {
        if (result) {
          // TODO: Consider something more sophisticated here
          const messageText = result.output.generic[0].text
          sendWatsonResponse.bind(this)(
            messageText,
            message.data,
            message.context,
            result.output.entities,
            result.output.intents
          )
        } else {
          debug('Empty result during message analysis')
        }
      })
      .catch((err) => {
        debug('In-Progress Message analysis failed')
        debug(err)
      })
  }

  // Bounce message to wizard (no logging because it floods the console)
  if (isWizardEnabled()) {
    getMySocket().to('wizards').emit('clientTyping', {
      clientEmail: userInfo.email,
      context: message.context,
      data: message.data
    })
  }
}

// Attempt to send message from Client
// - 'this' = current socket
export async function socketMessageSend (message) {
  if (!this.request.session || !this.request.session.userInfo) {
    debug(`[WS:${this.id}] sending message before login`)
    return
  }

  // Update user's list of context aliases (their username in a service like Discord or Teams)
  const userInfo = this.request.session.userInfo
  DBUser.setUserAlias(userInfo.id, message.context, message.aliasId, message.aliasName, message.avatarURL)
    .catch((err) => {
      debug('Alias update failed')
      debug(err)
    })

  // Log the message for telemetry and analysis
  // TODO: do we have the ID of the person receiving the message?
  DBLog.logUserMessage(message, null, userInfo.id)
    .catch((err) => {
      debug('client message logging failed')
      debug(err)
    })

  // Hook to intelligence core, expect a promise in return
  if (isWatsonEnabled()) {
    debug(`[WS:${this.id}] message sent to watson from ${message.context}`)
    Analysis.analyzeMessage(message, userInfo.id, message.context, true)
      .then((result) => {
        // TODO: Consider something more sophisticated here
        const messageText = result.output.generic[0].text
        sendWatsonResponse.bind(this)(
          messageText,
          message,
          message.context,
          result.output.entities,
          result.output.intents
        )
      })
      .catch((err) => {
        debug('Completed Message analysis failed')
        debug(err)
      })
  }

  // Log action (if debug is enabled) and send the message to the wizard
  if (isWizardEnabled()) {
    debug(`[WS:${this.id}] message sent to wizard from ${message.context}`)
    getMySocket().to('wizards').emit('clientSend', {
      clientEmail: userInfo.email,
      context: message.context,
      data: message.data
    })
  }
}

export async function userStatusUpdated (userID) {
  DBUser.getUserDetails(userID)
    .then((details) => {
      // Get list of teams
      const teams = details?.teams ? details.teams : []
      if (Array.isArray(teams) && teams.length > 0) {
        // Send latest status to all team rooms
        getMySocket().to(teams.map((teamID) => (`team-${teamID}`)))
          .emit('teammateStatusUpdate', {
            userId: userID,
            context: '*',
            currentAffectID: details.status.currentAffectID,
            collaboration: details.status.collaboration,
            timeToRespond: details.status.timeToRespond
          })
      }
    })
    .catch((err) => {
      debug(`Failed to broadcast status: could not get user details for ${userID}`)
      debug(err)
    })
}

export function sendStatusMessage (socket, context, userEmail, replyToStatus, mentionsStatus, participantsStatus) {
  if (socket) {
    debug('emitting status message')
    getMySocket().to(socket.id).emit('statusMessage', {
      clientEmail: userEmail,
      context: context,
      replyToStatus,
      mentionsStatus,
      participantsStatus
    })
  }
}
