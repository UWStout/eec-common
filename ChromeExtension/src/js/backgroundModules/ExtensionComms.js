// Functions from other background modules
import { readValue, writeValue } from './DataStorage.js'
import { getSocket, announceSession, endSession } from './SocketComms.js'
import { isValidContext } from '../util/contexts.js'

// List of active extension communication ports
const portSessions = {}

/**
 * Initialize communications with other parts of the chrome extension.
 * @see {@link https://developer.chrome.com/extensions/messaging}
 * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime}
 */
export function setupExtensionCommunication () {
  // Listen for one-off messages from other parts of extension
  chrome.runtime.onMessage.addListener(oneTimeMessage)

  // Listen to long lived messages from in-content.js
  chrome.runtime.onConnect.addListener(portListener)

  // Route messages from the Karuna server back to the proper port
  getSocket().on('karunaMessage', (msg) => {
    // Loop through active port names and look for matching context
    for (const portName in portSessions) {
      const context = portName.split('/')[0]
      if (context === msg.context) {
        // Relay message to that port
        portSessions[portName].postMessage(
          { type: 'karunaMessage', ...msg }
        )
      }
    }
  })
}

/**
 * Respond to a single message from Chrome.runtime.onMessage. Used to read and write values
 * from extension's LocalStorage only. May also be used for Karuna server AJAX requests in
 * the future.
 * @param {Object} message The message itself.
 * @param {MessageSender} sender Object representing the sender of the message
 * @param {function} sendResponse callback function to respond
 * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage}
 * @see {@link https://developer.chrome.com/extensions/runtime#event-onMessage}
 */
function oneTimeMessage (message, sender, sendResponse) {
  // Determine sender id (context scripts have a tab, popup does not)
  const senderID = sender.tab?.id || sender.id

  // Return as a promise per recommendations from Mozilla
  return new Promise((resolve, reject) => {
    // Parse out the message structure if it is JSON
    if (!message.type && typeof message === 'string') {
      try {
        message = JSON.parse(message)
      } catch (error) {
        console.log(`[BACKGROUND] Invalid one-time message from "${senderID}"`)
        return reject(new Error(`Malformed message from ${senderID}`))
      }
    }

    // check message structure
    if (!message.type || !message.key) {
      console.log(`[BACKGROUND] Incomplete one-time message from "${senderID}"`)
      return reject(new Error(`Message from ${senderID} missing type or key`))
    }

    // Execute message
    switch (message.type.toLowerCase()) {
      // Read a value from storage
      case 'read':
        sendResponse()
        resolve({ value: readValue(message.key, message.context) })
        break

      // Write a value to storage
      case 'write':
        resolve({ result: writeValue(message.key, message.data, message.context) })
        break

      // Unknown messages
      default:
        console.log(`[BACKGROUND] Unknown message type "${message.type}" from '${senderID}'`)
        reject(new Error(`Message from ${senderID} has unknown type "${message.type}"`))
    }
  })
}

/**
 * Listener for newly connected runtime port. Allows communication between different
 * parts of the extension through a persistent connection port.
 * @param {runtime.Port} port The new port being connected
 * @see {@link https://developer.chrome.com/extensions/runtime#event-onConnect}
 */
function portListener (port) {
  // Extract important identification data
  const tabID = port.sender?.tab?.id || ''
  const context = port.name
  const fullPortID = `${context}-${tabID}`

  // Is this a valid context?
  if (!isValidContext(context)) {
    console.log(`[BACKGROUND] Invalid port context "${context}". Ignoring connection.`)
    return
  }

  // Create a port session for this context
  if (portSessions[fullPortID]) {
    // Disconnect previous port first
    portSessions[fullPortID].disconnect()
  }
  portSessions[fullPortID] = port

  // Announce the session to the karuna server
  console.log(`[BACKGROUND] Session opened for "${fullPortID}"`)
  announceSession(context)

  // Listen for standard messages
  port.onMessage.addListener((message) => {
    switch (message.type) {
      // Text is updating in an in-context script
      case 'textUpdate':
        getSocket().emit('messageUpdate', {
          type: 'textUpdate',
          subType: '',
          context: context,
          user: readValue('userName', context),
          team: readValue('teamName', context),
          channel: readValue('channelName', context),
          data: message.content
        })
        break

      // Other unexpected messages
      default:
        console.log(`[BACKGROUND] Unknown port message "${message.type}" from '${fullPortID}'`)
    }
  })

  // Respond to a port disconnecting
  port.onDisconnect.addListener((disconnectedPort) => {
    console.log(`[BACKGROUND] Session closed for "${fullPortID}"`)
    portSessions[fullPortID] = undefined
    endSession(context)
  })
}
