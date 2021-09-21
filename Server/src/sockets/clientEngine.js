// Database log and user controller objects
import * as DBUser from '../mongo/userController.js'
import * as DBLog from '../mongo/logController.js'

import { decodeToken, getMySocket, isWizardEnabled, isWatsonEnabled } from '../sockets.js'
import { sendWatsonResponse } from './watsonEngine.js'

// Helper methods
import * as Analysis from './analysisEngine.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:client-socket-engine')

// Session management
const clientSessions = {}
const clientSocketLookup = {}

export function getAllClientSessions () {
  return clientSessions
}

export function getClientSession (id) {
  return clientSessions[id]
}

export function lookupClientSessionId (email) {
  return clientSocketLookup[email]
}

export function clearClientSession (id) {
  if (id) {
    const email = clientSessions[this.id].email
    clientSessions[id] = undefined
    if (email) {
      clientSocketLookup[email] = undefined
    }
  }
}

// Establish an in-memory session for a connected client
// - 'this' = current socket
export function socketClientSession (clientInfo) {
  if (clientSessions[this.id]) {
    debug(`[WS:${this.id}] updated client session (${clientInfo.context})`)
    clientSocketLookup[clientSessions[this.id].email] = undefined // In case the email has changed
  } else {
    // Join the universal clients room and a room for JUST this socket
    debug(`[WS:${this.id}] new client session (${clientInfo.context})`)
    this.join('clients')
    this.join(this.id)
  }

  // Is there a valid token
  if (!clientInfo.token) {
    debug(`[WS:${this.id}] invalid - client session token missing`)
    return
  }

  // Decode client token
  const tokenPayload = { ...decodeToken(clientInfo.token) }

  // Check for any timed triggers on a non-global session
  if (clientInfo.context !== 'global') {
    Analysis.checkTimedTriggers(tokenPayload)
      .catch((err) => {
        debug('Error checking timed triggers on client session update')
        debug(err)
      })
  }

  // Write/Update session and broadcast change
  clientSessions[this.id] = { ...clientSessions[this.id], ...tokenPayload }
  clientSocketLookup[clientSessions[this.id].email] = this.id

  // Connect to team rooms if not already
  if (!clientSessions[this.id].teams) {
    DBUser.getUserDetails(tokenPayload.id)
      .then((result) => {
        const teams = result?.teams ? result.teams : []
        teams.forEach((teamID) => {
          this.join(`team-${teamID}`)
        })
        clientSessions[this.id].teams = result.teams
      })
      .catch((err) => {
        debug('Error retrieving user team list, can\'t add to team rooms.')
        debug(err)
      })
  }

  // If not a global connect, update context list, timestamps, and optionally broadcast change
  if (clientInfo.context !== 'global') {
    // Pack in array if not already
    if (!Array.isArray(clientInfo.context)) {
      clientInfo.context = [clientInfo.context]
    }

    // Update session list
    clientSessions[this.id].contexts = [...clientInfo.context]

    // Broadcast to wizard
    if (isWizardEnabled()) {
      getMySocket().to('wizards').emit('updateSessions', clientSessions)
    }

    // Record the context connection in user entry in database
    const req = this.request
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    DBUser.updateUserTimestamps(clientSessions[this.id].id, address, clientSessions[this.id].contexts)
      .catch((err) => {
        console.error('WARNING: Failed to update context timestamp')
        console.error(err)
      })
  }
}

// Updated text of message being written
// - 'this' = current socket
export function socketMessageUpdate (message) {
  if (!clientSessions[this.id]) {
    debug(`[WS:${this.id}] typing message before login`)
    return
  }

  // Update user's list of context aliases (their username in a service like Discord or Teams)
  const userID = clientSessions[this.id].id
  DBUser.setUserAlias(userID, message.context, message.user)
    .catch((err) => {
      debug('Alias update failed')
      debug(err)
    })

  debug(`[WS:${this.id}] draft message sent to watson from ${message.context}${isWatsonEnabled() ? '' : ' (DISABLED)'}`)
  if (isWatsonEnabled()) {
    debug('Inside line 278')
    // Hook to intelligence core, expect a promise in return
    Analysis.analyzeMessage(message, userID, message.context, false)
      .then((result) => {
        if (result) {
          // TODO: Consider something more sophisticated here
          const messageText = result.output.generic[0].text
          sendWatsonResponse.bind(this)(
            messageText,
            message,
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
      clientEmail: clientSessions[this.id].email,
      context: message.context,
      data: message.data
    })
  }
}

// Attempt to send message from Client
// - 'this' = current socket
export async function socketMessageSend (message) {
  if (!clientSessions[this.id]) {
    debug(`[WS:${this.id}] sending message before login`)
    return
  }

  // Update user's list of context aliases (their username in a service like Discord or Teams)
  const userID = clientSessions[this.id].id
  DBUser.setUserAlias(userID, message.context, message.user)
    .catch((err) => {
      debug('Alias update failed')
      debug(err)
    })

  // Log the message for telemetry and analysis
  // TODO: do we have the ID of the person receiving the message?
  DBLog.logUserMessage(message, null, userID)
    .catch((err) => {
      debug('client message logging failed')
      debug(err)
    })

  // Hook to intelligence core, expect a promise in return
  debug(`[WS:${this.id}] message sent to watson from ${message.context}${isWatsonEnabled() ? '' : ' (DISABLED)'}`)
  if (isWatsonEnabled()) {
    debug('Inside line 337')
    Analysis.analyzeMessage(message, userID, message.context, true)
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
      clientEmail: clientSessions[this.id].email,
      context: message.context,
      data: message.data
    })
  }
}

export async function userStatusUpdated (userID) {
  DBUser.getUserDetails(userID)
    .then((details) => {
      const socketID = clientSocketLookup[details?.email]
      if (socketID) {
        if (Array.isArray(clientSessions[socketID].teams) && clientSessions[socketID].teams.length > 0) {
          // Send message to all team rooms but NOT to this user's socket
          getMySocket().to(
            // Create array of team room names
            clientSessions[socketID].teams.map((teamID) => (`team-${teamID}`))
          )
            // Send latest status
            .emit('teammateStatusUpdate', {
              userId: userID,
              context: '*',
              currentAffectID: details.status.currentAffectID,
              collaboration: details.status.collaboration,
              timeToRespond: details.status.timeToRespond
            })
        } else {
          debug('No teams to emit too / teams invalid:')
          debug(clientSessions[socketID].teams)
        }
      } else {
        debug(`Failed to broadcast status: could not find socket session for user ${details?.email}`)
      }
    })
    .catch((err) => {
      debug(`Failed to broadcast status: could not get user details for ${userID}`)
      debug(err)
    })
}
