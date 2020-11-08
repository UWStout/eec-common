// Import the socket.io library
import SocketIO from 'socket.io'

// Integrate our web-sockets route with the express server
export function makeSocket (serverListener) {
  // Setup web-sockets
  const io = SocketIO(serverListener)

  // Respond to new socket connections
  io.on('connection', (socket) => {
    console.log('a user connected')

    // Listen for events with 'socket' bound as 'this'
    socket.on('disconnect', socketDisconnect.bind(socket))
    socket.on('messageUpdate', socketMessageUpdate.bind(socket))
    socket.on('messageSend', socketMessageSend.bind(socket))
  })

  // Catch and log errors
  io.on('error', (err) => {
    console.error('Socket.io error:')
    console.error(err)
  })

  // Return the socket.io interface
  return io
}

// Respond to socket.disconnect events
// - 'this' = current socket
function socketDisconnect (reason) {
  console.log(`[WS:${this.id}] disconnected because - ${reason}`)
}

// Updated text of message being written
// - 'this' = current socket
function socketMessageUpdate (text) {
  console.log(`[WS:${this.id}] message update "${text}"`)
}

// Attempt to send message
// - 'this' = current socket
function socketMessageSend (message) {
  console.log(`[WS:${this.id}] message sent "${message}"`)
}
