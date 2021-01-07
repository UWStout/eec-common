// Bring in context strings
import { CONTEXT } from '../../../util/contexts.js'

// Functions from other background modules
import { readValue } from '../DataStorage.js'
import { getSocket } from '../SocketComms.js'

// Slack specific filters
// Only intercept messages to these urls and of the indicated types
export const filters = {
  urls: ['http://*.slack.com/api/*', 'https://*.slack.com/api/*'],
  types: ['xmlhttprequest', 'websocket']
}

// Internally, discord marks their messages with these types
const msgTypeFilters = [
  'reactions', 'chat'
]

/**
 * Event listener for Slack. Identifies and responds to message and typing requests
 * relaying the data to the Karuna server before it is sent to Slack's server.
 * @param {Object} details The parameter provided to the WebRequest 'onBeforeRequest' callback
 * @see {@link https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest}
 */
export function listener (details) {
  // Ignore all OPTIONS requests (part of cors)
  if (details.method.toLowerCase() === 'options') {
    return
  }

  // Determine the type and sub-type of the request
  const URLParts = details.url.split('/')
  let requestTypePart = URLParts[4].split('?')[0]
  const requestParts = requestTypePart.split('?')[0].split('.')
  requestTypePart = requestParts[0]
  const requestSubTypePart = requestParts[1]

  // Decode message content
  let requestContent = ''
  switch (requestTypePart) {
    // Chat messages being sent
    case 'chat':
      // Look for and decode message text
      if (details.requestBody) {
        const dataBlock = details.requestBody.formData.blocks[0]
        const dataSent = JSON.parse(dataBlock)[0]

        console.log(dataSent)
        requestContent = gatherAllText(dataSent)
      }
      break

    // Emoji reactions to other messages
    case 'reactions':
      requestContent = details.requestBody.formData.name[0]
      break

    // Ignore all other api requests
    default:
      break
  }

  // Only respond to matched message types
  if (msgTypeFilters.find((curFilter) => { return requestTypePart.startsWith(curFilter) })) {
    // Send the socket data
    if (requestTypePart === 'chat' && requestContent) {
      console.log('[[IN-CONTENT]] Sending socket message for Slack')
      const wsMsg = {
        type: requestTypePart,
        subType: requestSubTypePart,
        context: CONTEXT.SLACK,
        user: readValue('userName', CONTEXT.SLACK),
        team: readValue('teamName', CONTEXT.SLACK),
        channel: readValue('channelName', CONTEXT.SLACK),
        data: '[none]'
      }
      getSocket().emit('messageSend', wsMsg)
    }

    // Log activity
    console.log(`[[IN-CONTENT]] Slack Message: ${requestTypePart}${requestSubTypePart ? '/' + requestSubTypePart : ''}  (${details.method})`)
    if (requestContent) {
      console.log(`[[IN-CONTENT]] Slack Message:    > "${requestContent}"`)
    }
  }
}

// Recurse through a JS object and retrieve all fields named 'text'
function gatherAllText (obj) {
  let gatheredText = ''
  if (obj !== null && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'text' && typeof value === 'string') {
        gatheredText += value
      }
      gatheredText += ' ' + gatherAllText(value)
    })
  }

  return gatheredText.trim()
}
