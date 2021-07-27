// Import the socket.io library
import * as io from 'socket.io'

// Import the handlebars template library
import Handlebars from 'handlebars'

// Database log and user controller objects
import * as DBUser from './mongo/userController.js'
import * as DBLog from './mongo/logController.js'

// Helper methods
import { parseMessageCommands, parseOtherUsers } from './socketMessageHelper.js'
import * as Analysis from './analysisEngine.js'

// Read env variables from the .env file
import dotenv from 'dotenv'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:socket')

// Adjust env based on .env file
dotenv.config()

// Option to enable the Watson analysis engine
// TODO: Consider disabling wizard when this is true
const WATSON_ENABLED = process.env?.WATSON_ENABLED === 'true'

// Useful global info
const clientSessions = {}
const clientSocketLookup = {}
const wizardSessions = {}

// Our root socket instance
let mySocket = null

// Integrate our web-sockets route with the express server
export function makeSocket (serverListener) {
  // Setup web-sockets
  mySocket = new io.Server(serverListener, { path: '/karuna/socket.io' })

  // Respond to new socket connections
  mySocket.on('connection', (socket) => {
    // Wizard specific messages
    socket.on('wizardSession', socketWizardSession.bind(socket))
    socket.on('wizardMessage', socketWizardMessage.bind(socket)) // <-- LOG TO DATABASE

    // sending message to client through karuna bubble
    socket.on('genericMessage', socketGenericMessage.bind(socket))

    // Client specific messages
    socket.on('clientSession', socketClientSession.bind(socket))
    socket.on('messageUpdate', socketMessageUpdate.bind(socket))
    socket.on('messageSend', socketMessageSend.bind(socket)) // <-- LOG TO DATABASE

    // General events
    socket.on('disconnect', socketDisconnect.bind(socket))
  })

  // Catch and log errors
  mySocket.on('error', (err) => {
    console.error('Socket.io error:')
    console.error(err)
  })

  // Return the socket.io interface
  return mySocket
}

// Respond to socket.disconnect events
// - 'this' = current socket
function socketDisconnect (reason) {
  if (wizardSessions[this.id]) {
    debug(`[WS:${this.id}] wizard disconnected because - ${reason}`)
    wizardSessions[this.id] = undefined
  } else if (clientSessions[this.id]) {
    debug(`[WS:${this.id}] client disconnected because - ${reason}`)
    clientSocketLookup[clientSessions[this.id].email] = undefined
    clientSessions[this.id] = undefined
  } else {
    debug(`[WS:${this.id}] unknown connection disconnected because - ${reason}`)
  }
}

// Helper function to decode a JWT payload
function decodeToken (token) {
  // Validate that token has a payload
  if (typeof token !== 'string' || token.split('.').length < 2) {
    return {}
  }

  // Attempt to decode and parse
  try {
    const payloadBuffer = Buffer.from(token.split('.')[1], 'base64')
    return JSON.parse(payloadBuffer.toString())
  } catch (e) {
    debug('Failed to parse JWT payload %o', e)
    return {}
  }
}

// Establish an in-memory session for a connected client
// - 'this' = current socket
function socketClientSession (clientInfo) {
  if (clientSessions[this.id]) {
    debug(`[WS:${this.id}] updated client session (${clientInfo.context})`)
    clientSocketLookup[clientSessions[this.id].email] = undefined // In case the email has changed
  } else {
    debug(`[WS:${this.id}] new client session (${clientInfo.context})`)
    this.join('clients')
  }

  // Is there a valid token
  if (!clientInfo.token) {
    debug(`[WS:${this.id}] invalid client session token missing`)
    return
  }

  // Check for any timed triggers
  Analysis.checkTimedTriggers(clientInfo)
    .then(() => {})
    .catch((err) => {
      debug('Error checking timed triggers on client session update')
      debug(err)
    })

  // Write/Update session and broadcast change
  clientSessions[this.id] = { ...decodeToken(clientInfo.token) }
  clientSocketLookup[clientSessions[this.id].email] = this.id

  // If not a global connect, update context list and broadcast change
  if (clientInfo.context !== 'global') {
    // Pack in array if not already
    if (!Array.isArray(clientInfo.context)) {
      clientInfo.context = [clientInfo.context]
    }

    // Update session list and broadcast
    clientSessions[this.id].contexts = [...clientInfo.context]
    mySocket.to('wizards').emit('updateSessions', clientSessions)

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

// Establish an in-memory session for a connected wizard
// - 'this' = current socket
function socketWizardSession (wizardInfo) {
  if (!wizardInfo.token) {
    console.error('ERROR: Wizard session missing access token')
  } else {
    wizardSessions[this.id] = { ...decodeToken(wizardInfo.token) }

    if (wizardSessions[this.id]) {
      debug(`[WS:${this.id}] updated wizard session for ${wizardSessions[this.id].email}`)
    } else {
      debug(`[WS:${this.id}] new wizard session for ${wizardSessions[this.id].email}`)
    }

    this.join('wizards')
    mySocket.to(this.id).emit('updateSessions', clientSessions)

    // Record the wizard login in user entry in database
    const req = this.request
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    DBUser.updateUserTimestamps(wizardSessions[this.id].id, address, true)
      .catch((err) => {
        console.error('WARNING: Failed to update wizard login timestamp')
        console.error(err)
      })
  }
}

// Broadcast a message from a wizard to a specific client
async function socketWizardMessage (messageInfo) {
  const destID = clientSocketLookup[messageInfo.clientEmail]
  if (destID) {
    // Pull out some local variables
    const correspondentID = clientSessions[destID].id
    let messageText = messageInfo.content

    // Scan for and replace any karuna-specific commands
    messageText = parseMessageCommands(messageText, messageInfo)

    // Are any user status variables being used?
    let userStatus = { affect: 'unknown', timeToRespond: 'unknown', collaboration: 'unknown' }
    if (messageText.match(/{{\s*user\.status.*?}}/)) {
      // Retrieve user status
      try {
        const response = await DBUser.getUserStatus(clientSessions[destID].id)
        if (response) {
          userStatus = {
            affect: response.currentAffectID || 'unknown',
            timeToRespond: response.timeToRespond || NaN,
            collaboration: response.collaboration || 'unknown'
          }
        }
      } catch (err) {
        debug('Error getting user status')
        debug(err)
      }
    }

    try {
      // Get any extra user data needed for mentioned users
      const extraUsers = await parseOtherUsers(messageText, messageInfo, DBUser)

      // Fill-in handlebars templates if they exist
      if (messageText.includes('{{')) {
        const msgTemplate = Handlebars.compile(messageText)
        messageText = msgTemplate({
          user: {
            ...clientSessions[destID],
            type: clientSessions[destID].userType,
            status: userStatus
          },
          ...extraUsers
        })
      }

      // Update message text and save in log (not waiting on logging, but we do catch errors)
      messageInfo.content = messageText
      DBLog.logWizardMessage(messageInfo, correspondentID)
        .catch((err) => {
          debug('Logging of wizard message failed')
          debug(err)
        })

      // Send the message on to client
      debug(`[WS:${this.id}] wizard message for client ${messageInfo.clientEmail} in ${messageInfo.context}`)
      mySocket.to(destID).emit('karunaMessage', messageInfo)
    } catch (err) {
      debug('Error awaiting other user parsing')
      debug(err)
    }
  } else {
    debug(`[WS:${this.id}] wizard sending to UNKNOWN client ${messageInfo.clientEmail} in ${messageInfo.context}`)
  }
}

async function socketGenericMessage (messageInfo) {
  const destID = clientSocketLookup[messageInfo.clientEmail]
  console.log('destID in socketGenericMessage: ' + destID)
  if (destID) {
    // Send the message on to client
    debug(`generic message for client ${messageInfo.clientEmail}`)
    mySocket.to(destID).emit('karunaMessage', messageInfo)
  } else {
    debug(`generic message sending to UNKNOWN client ${messageInfo.clientEmail} in ${messageInfo}`)
  }
}

// Updated text of message being written
// - 'this' = current socket
function socketMessageUpdate (message) {
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

  debug(`[WS:${this.id}] draft message sent to watson from ${message.context}${WATSON_ENABLED ? '' : ' (DISABLED)'}`)
  if (WATSON_ENABLED) {
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
  mySocket.to('wizards').emit('clientTyping', {
    clientEmail: clientSessions[this.id].email,
    context: message.context,
    data: message.data
  })
}

// Attempt to send message from Client
// - 'this' = current socket
async function socketMessageSend (message) {
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
  debug(`[WS:${this.id}] message sent to watson from ${message.context}${WATSON_ENABLED ? '' : ' (DISABLED)'}`)
  if (WATSON_ENABLED) {
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
  debug(`[WS:${this.id}] message sent to wizard from ${message.context}`)
  mySocket.to('wizards').emit('clientSend', {
    clientEmail: clientSessions[this.id].email,
    context: message.context,
    data: message.data
  })
}

// Attempt to send message to client FROM Watson
// - 'this' = client socket
export function sendWatsonResponse (responseText, clientPromptObj, clientContext, entities, intents) {
  if (responseText.trim() === '') {
    console.log('ignoring empty watson message')
    return
  }

  const messageObj = {
    clientEmail: clientSessions[this.id].email,
    context: clientContext,
    content: responseText,
    entities,
    intents
  }

  DBLog.logWatsonMessage(messageObj, clientPromptObj, clientSessions[this.id].id)
    .catch((err) => {
      debug('Logging of watson message failed')
      debug(err)
    })

  console.log('sending response from watson')
  this.emit('karunaMessage', messageObj)
}

export function sendGenericMessage (message, userID, context) {
  if (message.trim() === '') {
    return
  }
  // get User email from userID
  // use DBUser
  // console.log('userID: ' + userID)

  DBUser.getUserDetails(userID)
    .then((details) => {
      console.log(details)
      const userEmail = details.email
      console.log(userEmail)
      const socketID = clientSocketLookup[userEmail]

      // Broadcast to all sockets
      console.log(`Broadcasting message to ${userEmail} - ${message}`)

      console.log('context is ' + context)

      if (socketID) {
        console.log('emitting generic message')
        mySocket.to(socketID).emit('karunaMessage', {
          clientEmail: userEmail, // user email
          context: context,
          content: message
        })
      }
    })
    .catch((err) => {
      debug('could not get user details')
      debug(err)
    })
}
