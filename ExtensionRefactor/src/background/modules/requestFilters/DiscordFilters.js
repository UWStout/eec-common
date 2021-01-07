// Bring in context strings
import { CONTEXT } from '../../../util/contexts.js'

// Functions from other background modules
import { readValue } from '../DataStorage.js'
import { getSocket } from '../SocketComms.js'

// Discord specific filters
// Only intercept messages to these urls and of the indicated types
export const filters = {
  urls: ['http://discord.com/*', 'https://discord.com/*'],
  types: ['xmlhttprequest', 'websocket']
}

// Internally, discord marks their messages with these types
const msgTypeFilters = [
  'typing', 'messages'
]

/**
 * Event listener for Discord. Identifies and responds to message and typing requests
 * relaying the data to the Karuna server before it is sent to Discord's server.
 * @param {Object} details The parameter provided to the WebRequest 'onBeforeRequest' callback
 * @see {@link https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest}
 */
export function listener (details) {
  // Ignore all OPTIONS requests (part of cors)
  if (details.method.toLowerCase() === 'options') {
    return
  }

  // Determine type and sub-type of request
  const URLParts = details.url.split('/')
  let requestTypePart = ''
  if (URLParts.length > 7) {
    requestTypePart = URLParts[7].toLowerCase()
  }

  let requestSubTypePart = ''
  if (URLParts.length > 9) {
    requestSubTypePart = URLParts[9]
  }

  // Respond to request types and sub-types
  let requestContent = ''
  switch (requestTypePart) {
    case 'messages':
      // Decode any reaction emoji's and target names
      if (requestSubTypePart === 'reactions') {
        // Ignore reaction get requests
        if (details.method === 'GET') {
          requestTypePart = ''
        }
        requestContent = decodeURI(URLParts[10])
      } else {
        // Look for and decode message text
        if (details.requestBody) {
          const utf8decoder = new TextDecoder()
          const dataSent = JSON.parse(utf8decoder.decode(details.requestBody.raw[0].bytes))
          requestContent = dataSent.content
        }
      }
      break
  }

  // Only respond to matched message types
  if (msgTypeFilters.find((curFilter) => { return requestTypePart.startsWith(curFilter) })) {
    // Send the socket data
    if (requestTypePart === 'messages' && requestContent) {
      console.log('[[IN-CONTENT]] Sending socket message for discord')
      const wsMsg = {
        type: requestTypePart,
        subType: requestSubTypePart,
        context: CONTEXT.DISCORD,
        user: readValue('userName', CONTEXT.DISCORD),
        team: readValue('teamName', CONTEXT.DISCORD),
        channel: readValue('channelName', CONTEXT.DISCORD),
        data: requestContent
      }
      getSocket().emit('messageSend', wsMsg)
    }

    // Log the action
    console.log(`[[IN-CONTENT]] Discord Message: ${requestTypePart}${requestSubTypePart ? '/' + requestSubTypePart : ''}  (${details.method})`)
    if (requestContent) {
      console.log(`[[IN-CONTENT]] Discord Message:    > "${requestContent}"`)
    }
  }
}
