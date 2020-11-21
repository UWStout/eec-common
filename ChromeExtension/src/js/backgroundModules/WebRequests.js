// Bring in context strings
import { CONTEXT } from '../util/contexts.js'

// Functions from other background modules
import { readValue } from './DataStorage.js'
import { getSocket } from './SocketComms.js'

// Discord specific filters
// Only intercept messages to these urls and of the indicated types
const discordFilters = {
  urls: ['http://discord.com/*', 'https://discord.com/*'],
  types: ['xmlhttprequest', 'websocket']
}

// Internally, discord marks their messages with these types
const discordTypeFilters = [
  'typing', 'messages'
]

// MS-Teams specific filters
// Only intercept messages to these urls and of the indicated types
const msTeamsFilters = {
  urls: ['*://*.msg.teams.microsoft.com/*'],
  types: ['xmlhttprequest', 'websocket']
}

// Internally, teams marks their messages with these types
const msTeamsTypeFilters = [
  'properties', 'messages'
]

/**
 * Install the listeners globally. All chrome messages that match the filters used
 * will be intercepted but not blocked.
 * @see {@link https://developer.chrome.com/extensions/webRequest}
 */
export function setupWebRequests () {
  // Listen for all websocket & xhr messages to the discord server
  chrome.webRequest.onBeforeRequest.addListener(
    discordListener, discordFilters, ['blocking', 'requestBody']
  )

  // Listen for all websocket & xhr messages to the teams server
  chrome.webRequest.onBeforeRequest.addListener(
    msTeamsListener, msTeamsFilters, ['blocking', 'requestBody']
  )
}

/**
 * Event listener for Discord. Identifies and responds to message and typing requests
 * relaying the data to the Karuna server before it is sent to Discord's server.
 * @param {Object} details The parameter provided to the WebRequest 'onBeforeRequest' callback
 * @see {@link https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest}
 */
function discordListener (details) {
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
  if (discordTypeFilters.find((curFilter) => { return requestTypePart.startsWith(curFilter) })) {
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

/**
 * Event listener for MSTeams. Identifies and responds to message and typing requests
 * relaying the data to the Karuna server before it is sent to Microsoft's server.
 * @param {Object} details The parameter provided to the WebRequest 'onBeforeRequest' callback
 * @see {@link https://developer.chrome.com/extensions/webRequest#event-onBeforeRequest}
 */
function msTeamsListener (details) {
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
        console.log(domEl.children[0])
        if (domEl.children[0] && domEl.children[0].children) {
          console.log(domEl.children[0].children)
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
  if (msTeamsTypeFilters.find((curFilter) => { return requestTypePart.startsWith(curFilter) })) {
    // Send the socket data
    if (requestTypePart === 'messages' && requestContent) {
      console.log('[[IN-CONTENT]] Sending socket message for MSTeams')
      const wsMsg = {
        type: requestTypePart,
        subType: requestSubTypePart,
        context: CONTEXT.MS_TEAMS,
        user: readValue('userName', CONTEXT.MS_TEAMS),
        team: readValue('teamName', CONTEXT.MS_TEAMS),
        channel: readValue('channelName', CONTEXT.MS_TEAMS),
        data: requestContent
      }
      getSocket().emit('messageSend', wsMsg)
    }

    // Log activity
    console.log(`[[IN-CONTENT]] MSTeams Message: ${requestTypePart}${requestSubTypePart ? '/' + requestSubTypePart : ''}  (${details.method})`)
    if (requestContent) {
      console.log(`[[IN-CONTENT]] MSTeams Message:    > "${requestContent}"`)
    }
  }
}
