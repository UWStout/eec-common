// Import the socket.io library
import SocketIO from 'socket.io'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('server:socket')

// Useful global info
const clientSessions = {}
const clientSocketLookup = {}
const wizardSessions = {}

// Our root socket instance
let mySocket = null

// Integrate our web-sockets route with the express server
export function makeSocket (serverListener) {
  // Setup web-sockets
  mySocket = SocketIO(serverListener)

  // Respond to new socket connections
  mySocket.on('connection', (socket) => {
    // Wizard specific messages
    socket.on('wizardSession', socketWizardSession.bind(socket))
    socket.on('wizardMessage', socketWizardMessage.bind(socket))

    // Client specific messages
    socket.on('clientSession', socketClientSession.bind(socket))
    socket.on('messageUpdate', socketMessageUpdate.bind(socket))
    socket.on('messageSend', socketMessageSend.bind(socket))

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
    clientSocketLookup[clientSessions[this.id].email] = undefined // Incase the email has changed
  } else {
    debug(`[WS:${this.id}] new client session (${clientInfo.context})`)
    this.join('clients')
  }

  // Is there a valid token
  if (!clientInfo.token) {
    debug(`[WS:${this.id}] invalid client session token missing`)
    return
  }

  // Write/Update session and broadcast change
  clientSessions[this.id] = { email: decodeToken(clientInfo.token).email }
  clientSocketLookup[clientSessions[this.id].email] = this.id

  // If not a global connect, update context list and broadcast change
  if (Array.isArray(clientInfo.context)) {
    clientSessions[this.id].contexts = [...clientInfo.context]
    mySocket.to('wizards').emit('updateSessions', clientSessions)
  }
}

// Establish an in-memory session for a connected wizard
// - 'this' = current socket
function socketWizardSession (wizardInfo) {
  if (wizardSessions[this.id]) {
    debug(`[WS:${this.id}] updated wizard session`)
  } else {
    debug(`[WS:${this.id}] new wizard session`)
  }

  wizardSessions[this.id] = wizardInfo
  this.join('wizards')
  mySocket.to(this.id).emit('updateSessions', clientSessions)
}

// Broadcast a message from a wizard to a specific client
function socketWizardMessage (messageInfo) {
  const destID = clientSocketLookup[messageInfo.clientEmail]
  if (destID) {
    debug(`[WS:${this.id}] wizard message for client ${messageInfo.clientEmail} in ${messageInfo.context}`)
    mySocket.to(destID).emit('karunaMessage', messageInfo)
  } else {
    debug(`[WS:${this.id}] wizard sending to UNKNOWN client ${messageInfo.clientEmail} in ${messageInfo.context}`)
  }
}

// Updated text of message being written
// - 'this' = current socket
function socketMessageUpdate (message) {
  debug(`[WS:${this.id}] client typing in ${message.context}`)
  console.error(JSON.stringify(message, null, 2))
  mySocket.to('wizards').emit('clientTyping', {
    clientEmail: clientSessions[this.id].email,
    context: message.context,
    data: message.data
  })
}

// Attempt to send message
// - 'this' = current socket
function socketMessageSend (message) {
  debug(`[WS:${this.id}] message received from ${message.context}`)
  mySocket.to('wizards').emit('clientSend', {
    clientEmail: clientSessions[this.id].email,
    context: message.context,
    data: message.data
  })
}
