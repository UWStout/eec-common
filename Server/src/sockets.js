// Import the socket.io library
import * as io from 'socket.io'

// Import session manager middleware
import { getSessionMiddleware } from './sessionManager.js'

// Database log and user controller objects
import * as DBUser from './mongo/userController.js'

// Needed wizard session functions
import {
  socketWizardSession, socketWizardMessage,
  getWizardSession, clearWizardSession, isWizardEnabled
} from './sockets/wizardEngine.js'

// Needed client session functions
import {
  socketClientSession, socketMessageUpdate, socketMessageSend
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
  // Use session middleware
  const sessionMiddleware = getSessionMiddleware()

  // Setup web-sockets with session middleware
  mySocket = new io.Server(serverListener, { path: '/karuna/socket.io' })
  mySocket.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

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

    // Internal ping
    const boundSocketPing = socketPing.bind(socket)
    socket.conn.on('packet', (packet) => {
      if (packet.type === 'ping' || packet.type === 'pong') {
        boundSocketPing()
      }
    })
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
  this.request.sessionStore.destroy(
    this.request.session.id,
    (err) => {
      if (err) {
        debug(`[WS:${this.id}] Failed to destroy session (${err})`)
        debug(`[WS:${this.id}] unknown connection disconnected because - ${reason}`)
      } else {
        debug(`[WS:${this.id}] ${this.request.session.type} disconnected because - ${reason}`)
      }
    }
  )
}

// Log the ping from a client
// - 'this' = current socket
function socketPing () {
  if (this.request.session) {
    this.request.session.lastPing = Date.now()
    this.request.session.save()
  }
}

export function socketGenericMessage (messageInfo) {
  // Send the message on to client
  debug(`generic message for client ${messageInfo.clientEmail}`)
  mySocket.to(messageInfo.clientEmail).emit('karunaMessage', messageInfo)
}

export function sendGenericMessage (message, userID, context, showAffectSurvey = false, showOnboarding = false) {
  // Ignore empty messages
  if (message.trim() === '') { return }

  // Retrieve user details
  DBUser.getUserDetails(userID)
    .then((details) => {
      debug(`emitting generic message to ${details.email}:`, message)
      mySocket.to(details.email).emit('karunaMessage', {
        clientEmail: details.email, // user email
        context: context,
        content: message,
        affectSurvey: showAffectSurvey,
        needOnboarding: showOnboarding
      })
    })
    .catch((err) => {
      debug('could not get user details')
      debug(err)
    })
}
