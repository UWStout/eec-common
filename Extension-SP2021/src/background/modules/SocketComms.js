// Open socket to the karuna server
import { io } from 'socket.io-client'
import { isValidContext } from '../../util/contexts.js'

// Data storage functions
import { readValue } from './DataStorage.js'

// Server config
import * as SERVER_CONFIG from '../../util/serverConfig.js'

// Establish connection
let socket = null

/**
 * Initialize socket.io communications with Karuna server. Automatically announces
 * a 'global' session to the server on successful connect.
 * @see {@link https://socket.io/docs/v3/client-api/#io-url-options}
 * @see {@link https://socket.io/docs/v3/client-api/#socket-on-eventName-callback}
 */
export function setupSocketCommunication () {
  if (!socket || socket == null) {
    socket = io(`https://${SERVER_CONFIG.HOST_NAME}`, { path: '/karuna/socket.io' })
    socket.on('connect', () => { announceSession() })
  }
}

/**
 * Retrieve the active Socket.io connection. Will initialize connection if needed.
 */
export function getSocket () {
  setupSocketCommunication()
  return socket
}

// List of currently active contexts (maintained by announceSession below)
const activeContexts = new Set()

/**
 * Announce a new session to the Karuna server and add it to the list of active contexts.
 * If no context is provided a 'global' connect is announced.
 * @param {string} [context] Context string matching those in util/contexts.js
 * @see {@link https://socket.io/docs/v3/client-api/#socket-emit-eventName-%E2%80%A6args-ack}
 */
export function announceSession (context) {
  // Don't announce sessions if not logged in
  if (!readValue('JWT')) {
    return
  }

  // Determine list of contexts
  let sendContext = 'global'
  if (context) {
    if (!activeContexts.has(context)) {
      activeContexts.add(context)
    }
    sendContext = [...activeContexts]
  }

  // Update sessions & contexts on server
  getSocket().emit('clientSession', {
    context: sendContext,
    token: readValue('JWT')
  })
}

/**
 * Close an active session and update the Karuna server.
 * @param {string} context Context string matching those in util/contexts.js
 * @see {@link https://socket.io/docs/v3/client-api/#socket-emit-eventName-%E2%80%A6args-ack}
 */
export function endSession (context) {
  // Is this a valid and existing session?
  if (!isValidContext(context) || !activeContexts.has(context)) {
    console.log(`Request to close unknown session "${context}"`)
    return
  }

  // Remove context from active list
  activeContexts.delete(context)

  // Update sessions & contexts on server
  socket.emit('clientSession', {
    context: [...activeContexts],
    token: readValue('JWT')
  })
}
