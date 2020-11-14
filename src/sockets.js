// Import the socket.io library
import SocketIO from 'socket.io'

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
    console.log(`[WS:${this.id}] wizard disconnected because - ${reason}`)
    wizardSessions[this.id] = undefined
  } else if (clientSessions[this.id]) {
    console.log(`[WS:${this.id}] client disconnected because - ${reason}`)
    clientSocketLookup[clientSessions[this.id].email] = undefined
    clientSessions[this.id] = undefined
  } else {
    console.log(`[WS:${this.id}] unknown connection disconnected because - ${reason}`)
  }
}

// Helper function to decode a JWT payload
function decodeToken (token) {
  return JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  )
}

// Establish an in-memory session for a connected client
// - 'this' = current socket
function socketClientSession (clientInfo) {
  if (clientSessions[this.id]) {
    console.log(`[WS:${this.id}] updated client session`)
    clientSocketLookup[clientSessions[this.id].email] = undefined // Incase the email has changed
  } else {
    console.log(`[WS:${this.id}] new client session`)
  }

  // Update sessions and broadcast change
  clientSessions[this.id] = decodeToken(clientInfo.token)
  clientSocketLookup[clientSessions[this.id].email] = this.id
  this.join('clients')
  mySocket.to('wizards').emit('updateSessions', clientSessions)
}

// Establish an in-memory session for a connected wizard
// - 'this' = current socket
function socketWizardSession (wizardInfo) {
  if (wizardSessions[this.id]) {
    console.log(`[WS:${this.id}] updated wizard session`)
  } else {
    console.log(`[WS:${this.id}] new wizard session`)
  }

  wizardSessions[this.id] = wizardInfo
  this.join('wizards')
  mySocket.to(this.id).emit('updateSessions', clientSessions)
}

// Broadcast a message from a wizard to a specific client
function socketWizardMessage (messageInfo) {
  const destID = clientSocketLookup[messageInfo.clientEmail]
  if (destID) {
    console.log(`[WS:${this.id}] wizard message for client ${messageInfo.clientEmail}`)
    mySocket.to(destID).emit('karunaMessage', messageInfo)
  } else {
    console.log(`[WS:${this.id}] wizard sending to UNKNOWN client ${messageInfo.clientEmail}`)
  }
}

// Updated text of message being written
// - 'this' = current socket
function socketMessageUpdate (text) {
  console.log(`[WS:${this.id}] client typing`)
  mySocket.to('wizards').emit('clientTyping', {
    clientEmail: clientSessions[this.id].email,
    typing: text.data
  })
}

// Attempt to send message
// - 'this' = current socket
function socketMessageSend (message) {
  console.log(`[WS:${this.id}] message send:`)
  mySocket.to('wizards').emit('clientSend', {
    clientEmail: clientSessions[this.id].email,
    message: message.data
  })
}
