// Import the socket.io library
import * as io from 'socket.io'

// Database log and user controller objects
import * as DBUser from './mongo/userController.js'

// Needed wizard session functions
import {
  socketWizardSession, socketWizardMessage,
  getWizardSession, clearWizardSession, isWizardEnabled
} from './sockets/wizardEngine.js'

// Needed client session functions
import {
  socketClientSession, socketMessageUpdate, socketMessageSend,
  getClientSession, lookupClientSessionId, clearClientSession
} from './sockets/clientEngine.js'

// Read env variables from the .env file
import dotenv from 'dotenv'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:socket')

// Adjust env based on .env file
dotenv.config()

// Our root socket instance
let mySocket = null

export function getMySocket () {
  return mySocket
}

// Helper function to decode a JWT payload
export function decodeToken (token) {
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

// Integrate our web-sockets route with the express server
export function makeSocket (serverListener) {
  // Setup web-sockets
  mySocket = new io.Server(serverListener, { path: '/karuna/socket.io' })

  // Respond to new socket connections
  mySocket.on('connection', (socket) => {
    if (isWizardEnabled()) {
      // Wizard specific messages
      socket.on('wizardSession', socketWizardSession.bind(socket))
      socket.on('wizardMessage', socketWizardMessage.bind(socket)) // <-- LOG TO DATABASE
    }

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
  if (getWizardSession(this.id)) {
    debug(`[WS:${this.id}] wizard disconnected because - ${reason}`)
    clearWizardSession(this.id)
  } else if (getClientSession(this.id)) {
    debug(`[WS:${this.id}] client disconnected because - ${reason}`)
    clearClientSession(this.id)
  } else {
    debug(`[WS:${this.id}] unknown connection disconnected because - ${reason}`)
  }
}

export async function socketGenericMessage (messageInfo) {
  const destID = lookupClientSessionId(messageInfo.clientEmail)
  console.log('destID in socketGenericMessage: ' + destID)
  if (destID) {
    // Send the message on to client
    debug(`generic message for client ${messageInfo.clientEmail}`)
    mySocket.to(destID).emit('karunaMessage', messageInfo)
  } else {
    debug(`generic message sending to UNKNOWN client ${messageInfo.clientEmail} in ${messageInfo}`)
  }
}

export function sendGenericMessage (message, userID, context, showAffectSurvey = false) {
  if (message.trim() === '') {
    return
  }

  DBUser.getUserDetails(userID)
    .then((details) => {
      const userEmail = details.email
      const socketID = lookupClientSessionId(userEmail)
      if (socketID) {
        debug('emitting generic message:', message)
        mySocket.to(socketID).emit('karunaMessage', {
          clientEmail: userEmail, // user email
          context: context,
          content: message,
          affectSurvey: showAffectSurvey
        })
      }
    })
    .catch((err) => {
      debug('could not get user details')
      debug(err)
    })
}
