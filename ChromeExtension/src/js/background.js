// Store2 local storage library
import store from 'store2'

// Open socket to the karuna server
import io from 'socket.io-client'

// Establish connection
const socket = io('http://localhost:3000')
socket.on('connect', () => {
  socket.emit('clientSession', {
    token: store.local.get('JWT')
  })
})

// Listen for messages from the karuna server
socket.on('karunaServer', (msg) => {
  console.log(`[WS:${socket.id}] message received - ${msg}`)
})

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
        context: 'discord',
        user: store.local.get('discord/userName'),
        team: store.local.get('discord/teamName'),
        channel: store.local.get('discord/channelName'),
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
        context: 'msteams',
        user: store.local.get('msteams/userName'),
        team: store.local.get('msteams/teamName'),
        channel: store.local.get('msteams/channelName'),
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
      case 'textUpdate':
        socket.emit('messageUpdate', {
          type: 'textUpdate',
          subType: '',
          context: 'msteams',
          user: store.local.get('msteams/userName'),
          team: store.local.get('msteams/teamName'),
          channel: store.local.get('msteams/channelName'),
          data: message.content
        })
        break
    }
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

  // Build message key-name
  let keyContext = message.key
  if (message.context) {
    keyContext = `${message.context}/${message.key}`
  }

  // Execute message
  switch (message.type.toLowerCase()) {
    // Read a value from storage
    case 'read':
      sendResponse(store.local.get(keyContext))
      break

    // Write a value to storage
    case 'write':
      store.local.set(keyContext, message.data, true)
      break
  }
})
