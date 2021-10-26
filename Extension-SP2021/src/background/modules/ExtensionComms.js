// Functions from other background modules
import { readValue, writeValue, clearValue, retrieveUser } from './DataStorage.js'
import { getSocket, announceSession, endSession } from './SocketComms.js'
import { processAjaxRequest, setUserAliasValues } from './ServerAJAXComms.js'

import { isValidContext } from '../../util/contexts.js'

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
    console.log('[BACKGROUND] Karuna message received from server:', msg)
    if (msg.context === '*') {
      // Loop through active port names and broadcast message to all
      for (const portName in portSessions) {
        if (portSessions[portName]) {
          console.log(`[BACKGROUND] posting karuna message to ${portName}`)
          portSessions[portName].postMessage(
            { type: 'karunaMessage', ...msg }
          )
        }
      }
    } else {
      // Loop through active port names and look for matching context
      for (const portName in portSessions) {
        const context = portName.split('-')[0]
        if (context === msg.context && portSessions[portName]) {
          // Relay message to that port
          console.log('[BACKGROUND] + Context matched, posting karuna message')
          portSessions[portName].postMessage(
            { type: 'karunaMessage', ...msg }
          )
        }
      }
    }
  })

  getSocket().on('statusMessage', (msg) => {
    console.log('[BACKGROUND] JIT status message received from server:', msg)
    // Loop through active port names and broadcast message to matching context
    for (const portName in portSessions) {
      const context = portName.split('-')[0]
      if (context === msg.context && portSessions[portName]) {
        console.log(`[BACKGROUND] posting JIT status message to ${portName}`)
        portSessions[portName].postMessage(
          { type: 'statusMessage', ...msg }
        )
      }
    }
  })

  getSocket().on('teammateStatusUpdate', (msg) => {
    console.log('[BACKGROUND] Teammate status message received from server:', msg)
    // Loop through active port names and broadcast message to all
    for (const portName in portSessions) {
      if (portSessions[portName]) {
        console.log(`[BACKGROUND] posting teammateStatus message to ${portName}`)
        portSessions[portName].postMessage(
          { type: 'teammateStatusUpdate', ...msg }
        )
      }
    }
  })

  getSocket().on('teammateInfoUpdate', (msg) => {
    console.log('[BACKGROUND] Teammate info update message received from server:', msg)
    // Loop through active port names and broadcast message to all
    for (const portName in portSessions) {
      if (portSessions[portName]) {
        console.log(`[BACKGROUND] posting teammateInfo message to ${portName}`)
        portSessions[portName].postMessage(
          { type: 'teammateInfoUpdate', ...msg }
        )
      }
    }
  })
}

function changedVals (message, keys) {
  // Setup arrays
  if (!Array.isArray(keys)) { keys = [keys] }

  // Compare what's stored with what's in the message object
  for (let i = 0; i < keys.length; i++) {
    if (message[keys[i]] && readValue(keys[i], message.context) !== message[keys[i]]) {
      return true
    }
  }

  return false
}

function updateVals (message, keys) {
  // Setup array
  if (!Array.isArray(keys)) { keys = [keys] }

  // Loop over keys and update them all
  for (let i = 0; i < keys.length; i++) {
    writeValue(keys[i], message[keys[i]], message.context)
  }
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
  const promise = new Promise((resolve, reject) => {
    // Parse out the message structure if it is JSON
    if (!message.type && typeof message === 'string') {
      try {
        message = JSON.parse(message)
      } catch (error) {
        console.log(`[BACKGROUND] Invalid one-time message from "${senderID}"`)
        const error2 = new Error(`Malformed message from ${senderID}`)
        sendResponse({ error: error2 })
        return reject(error2)
      }
    }

    // Handle ajax request messages
    if (message.type && message.type.startsWith('ajax-')) {
      return processAjaxRequest(message, resolve, reject, sendResponse)
    }

    // check message structure
    if (!message.type) {
      console.log(`[BACKGROUND] Incomplete one-time message from "${senderID}"`)
      console.log(message)
      const error = new Error(`Message from ${senderID} missing type or key`)
      sendResponse({ error })
      return reject(error)
    }

    // Execute message
    switch (message.type.toLowerCase()) {
      // Read a value from storage
      case 'read':
        sendResponse({ value: readValue(message.key, message.context) })
        return resolve({ value: readValue(message.key, message.context) }) // Mozilla

      // Write a value to storage
      case 'write':
        sendResponse({ result: writeValue(message.key, message.data, message.context) })
        return resolve({ result: writeValue(message.key, message.data, message.context) })

      // Context is updating for one tab
      case 'context':
        // Are the context values any different than before?
        if (changedVals(message, ['userName', 'userAppId', 'teamName', 'channelName', 'avatarSrc'])) {
          // Has the alias info changed from what is already in local storage
          if (changedVals(message, ['userName', 'userAppId', 'avatarSrc'])) {
            // Send new info to server (happens asynchronously, but we don't wait)
            const userInfo = retrieveUser()
            if (userInfo?.id) {
              setUserAliasValues(userInfo.id, message.context, message.userName, message.userAppId, message.avatarSrc)
            }
          }

          // Write all the new values to local storage
          updateVals(message, ['userName', 'userAppId', 'teamName', 'channelName', 'avatarSrc'])

          // Echo this message to all listening ports with the same 'context'
          for (const portName in portSessions) {
            if (portName.includes(message.context) && portSessions[portName]) {
              portSessions[portName].postMessage({ ...message })
            }
          }
        }

        // Indicate success
        sendResponse('ok')
        return resolve('ok')

      // Retrieve data about logged in user
      case 'getuser': {
        const userData = retrieveUser()
        sendResponse(userData)
        return resolve(userData)
      }

      // User successfully logged in (comes from popup)
      case 'login':
        // Save token
        writeValue('JWT', message.data)

        // Announce the global session
        announceSession()

        // Send the token to each in-context session
        for (const portName in portSessions) {
          // CAUTION: Sometimes it is undefined (not sure why)
          if (portSessions[portName]) {
            portSessions[portName].postMessage(
              { type: 'login', token: message.data }
            )
          }
        }
        sendResponse('ok')
        return resolve('ok')

      // Token was updated (same as login with the announceSession)
      case 'refresh':
        // Save token
        writeValue('JWT', message.data)

        // Send the token to each in-context session
        for (const portName in portSessions) {
          // CAUTION: Sometimes it is undefined (not sure why)
          if (portSessions[portName]) {
            portSessions[portName].postMessage(
              { type: 'login', token: message.data }
            )
          }
        }
        sendResponse('ok')
        return resolve('ok')

      case 'logout':
        // Clear the token in all sessions
        clearValue('JWT')
        for (const portName in portSessions) {
          portSessions[portName].postMessage(
            { type: 'logout' }
          )
        }
        sendResponse('ok')
        return resolve('ok')

      // Unknown messages
      default: {
        console.log(`[BACKGROUND] Unknown message type "${message.type}" from '${senderID}'`)
        const error = new Error(`Message from ${senderID} missing type or key`)
        sendResponse({ error })
        return reject(error)
      }
    }
  })
  return true
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
  if (context === 'global') {
    announceSession(context)
  }

  // Listen for standard messages
  port.onMessage.addListener((message) => {
    // Do nothing if not logged in
    if (!readValue('JWT')) { return }

    switch (message.type) {
      // In-content script is ready
      case 'contextReady':
        announceSession(message.context)
        break

      // Text is updating in an in-context script
      case 'textUpdate':
        getSocket().emit('messageUpdate', {
          type: 'textUpdate',
          subType: '',
          context: context,
          aliasId: readValue('userAppId', context),
          aliasName: readValue('userName', context),
          avatarURL: readValue('avatarSrc', context),
          team: readValue('teamName', context),
          channel: readValue('channelName', context),
          data: { ...message }
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
