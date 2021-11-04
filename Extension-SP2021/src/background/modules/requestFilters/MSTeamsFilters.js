// Bring in context strings
import { CONTEXT } from '../../../util/contexts.js'

// Functions from other background modules
import { readValue } from '../DataStorage.js'
import { getSocket } from '../SocketComms.js'

// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('MS TEAMS Filter', 'purple', 'white')

// MS-Teams specific filters
// Only intercept messages to these urls and of the indicated types
export const filters = {
  urls: ['*://*.msg.teams.microsoft.com/*'],
  types: ['xmlhttprequest', 'websocket']
}

// Internally, teams marks their messages with these types
const msgTypeFilters = [
  'properties', 'messages'
]

/**
 * Event listener for MSTeams. Identifies and responds to message and typing requests
 * relaying the data to the Karuna server before it is sent to Microsoft's server.
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
  let requestTypePart = URLParts[URLParts.length - 1].toLowerCase()
  let requestSubTypePart = ''
  if (requestTypePart.includes('?')) {
    const requestParts = requestTypePart.split('?')
    requestTypePart = requestParts[0]
    if (requestParts[1]) {
      const matches = requestParts[1].match(/name=(.+)/)
      requestSubTypePart = (matches && matches[1]) ? matches[1] : ''
    }
  }

  // Decode message content
  let requestContent = ''
  switch (requestTypePart) {
    case 'messages':
      // Look for and decode message text
      if (details.requestBody) {
        const utf8decoder = new TextDecoder()
        const dataSent = JSON.parse(utf8decoder.decode(details.requestBody.raw[0].bytes))
        requestContent = dataSent.content

        // Parse out any divs used to break lines
        const domEl = document.createElement('body')
        domEl.innerHTML = requestContent
        if (domEl.children[0] && domEl.children[0].children) {
          const text = []
          Array.from(domEl.children[0].children).forEach((div) => {
            text.push(div.textContent)
          })
          requestContent = text.join('\n')
        }
      }
      break

    case 'properties':
      // Decode emoji reaction type
      if (requestSubTypePart === 'emotions' && details.requestBody) {
        const utf8decoder = new TextDecoder()
        const dataSent = JSON.parse(utf8decoder.decode(details.requestBody.raw[0].bytes))
        requestContent = JSON.parse(dataSent.emotions).key
      } else if (requestSubTypePart === 'emotions') {
        console.log(details)
      }
      break
  }

  // Only respond to matched message types
  if (msgTypeFilters.find((curFilter) => { return requestTypePart.startsWith(curFilter) })) {
    // Send the socket data
    if (requestTypePart === 'messages' && requestContent) {
      LOG('Sending socket message for MSTeams')
      const wsMsg = {
        type: requestTypePart,
        subType: requestSubTypePart,
        context: CONTEXT.MS_TEAMS,
        user: readValue('userName', CONTEXT.MS_TEAMS),
        team: readValue('teamName', CONTEXT.MS_TEAMS),
        channel: readValue('channelName', CONTEXT.MS_TEAMS),
        data: 'REDACTED' // requestContent
      }
      getSocket().emit('messageSend', wsMsg)
    }

    // Log activity
    LOG(`MSTeams Message: ${requestTypePart}${requestSubTypePart ? '/' + requestSubTypePart : ''}  (${details.method})`)
    if (requestContent) {
      LOG(`MSTeams Message:    > "${requestContent}"`)
    }
  }
}
