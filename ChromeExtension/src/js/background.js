// Store2 local storage library
import store, { set } from 'store2'

// Open socket to the karuna server
import io from 'socket.io-client'

import { CONTEXT } from './util/contexts.js'

// Establish connection
const socket = io('http://localhost:3000')
socket.on('connect', () => { announceSession() })

const activeContexts = new Set()
function announceSession (context) {
  let sendContext = 'global'
  if (context) {
    if (!activeContexts.has(context)) {
      activeContexts.add(context)
    }
    sendContext = [...activeContexts]
  }

  socket.emit('clientSession', {
    context: sendContext,
    token: store.local.get('JWT')
  })
}

// Only intercept websocket messages to these urls
const discordFilters = {
  urls: ['http://discord.com/*', 'https://discord.com/*'],
  types: ['xmlhttprequest', 'websocket']
}

const discordTypeFilters = [
  'typing', 'messages'
]

const msTeamsFilters = {
  urls: ['*://*.msg.teams.microsoft.com/*'],
  types: ['xmlhttprequest', 'websocket']
}

const msTeamsTypeFilters = [
  'properties', 'messages'
]

// Listen for all websocket & xhr messages to the discord server
chrome.webRequest.onBeforeRequest.addListener((details) => {
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
        user: readValue(CONTEXT.DISCORD, 'userName'),
        team: readValue(CONTEXT.DISCORD, 'teamName'),
        channel: readValue(CONTEXT.DISCORD, 'channelName'),
        data: requestContent
      }
      socket.emit('messageSend', wsMsg)
    }

    // Log the action
    console.log(`[[IN-CONTENT]] Discord Message: ${requestTypePart}${requestSubTypePart ? '/' + requestSubTypePart : ''}  (${details.method})`)
    if (requestContent) {
      console.log(`[[IN-CONTENT]] Discord Message:    > "${requestContent}"`)
    }
  }
}, discordFilters, ['blocking', 'requestBody'])

// Listen for all websocket & xhr messages to the teams server
chrome.webRequest.onBeforeRequest.addListener((details) => {
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
        user: readValue(CONTEXT.MS_TEAMS, 'userName'),
        team: readValue(CONTEXT.MS_TEAMS, 'teamName'),
        channel: readValue(CONTEXT.MS_TEAMS, 'channelName'),
        data: requestContent
      }
      socket.emit('messageSend', wsMsg)
    }

    // Log activity
    console.log(`[[IN-CONTENT]] MSTeams Message: ${requestTypePart}${requestSubTypePart ? '/' + requestSubTypePart : ''}  (${details.method})`)
    if (requestContent) {
      console.log(`[[IN-CONTENT]] MSTeams Message:    > "${requestContent}"`)
    }
  }
}, msTeamsFilters, ['blocking', 'requestBody'])

// Listen to long lived messages from in-content.js
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    switch (message.type) {
      // connection from an in-context script
      case 'connect':
        announceSession(message.context)
        break

      // Text is updating in an in-context script
      case 'textUpdate':
        socket.emit('messageUpdate', {
          type: 'textUpdate',
          subType: '',
          context: message.context,
          user: readValue(message.context, 'userName'),
          team: readValue(message.context, 'teamName'),
          channel: readValue(message.context, 'channelName'),
          data: message.content
        })
        break
    }
  })

  // Listen for messages from the karuna server and relay to in-content
  socket.on('karunaMessage', (msg) => {
    port.postMessage({ type: 'karunaMessage', ...msg })
  })
})

// Listen to short lived messages from in-content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Parse out the message structure
  if (!message.type && typeof message === 'string') {
    try {
      message = JSON.parse(message)
    } catch (error) {
      console.log('BACKGROUND: Failed to parse message')
      console.log(message)
      return
    }
  }

  // check message structure
  if (!message.type || !message.key) {
    console.log('BACKGROUND: message missing type or key')
    console.log(message)
    return
  }

  // Execute message
  switch (message.type.toLowerCase()) {
    // Read a value from storage
    case 'read':
      sendResponse(readValue(message.context, message.key))
      break

    // Write a value to storage
    case 'write':
      writeValue(message.context, message.key, message.data)
      break
  }
})

function readValue (context, key) {
  const keyContext = context ? `${context}/${key}` : key
  return store.local.get(keyContext)
}

function writeValue (context, key, data, overwrite = true) {
  const keyContext = context ? `${context}/${key}` : key

  if (store.local.get(keyContext) !== undefined && !overwrite) {
    return false
  }

  store.local.set(keyContext, data, true)
  return true
}
