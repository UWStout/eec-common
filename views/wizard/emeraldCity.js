/* globals $, io, TinyMDE */

// Import chat widget making button
import { makeTabHeader, makeTabContentPane } from './chatWidgetHelper.js'

// Tab content holders
let tabHeaders
let tabContents

// The markdown editor elements
let editor
let toolbar

// Session lookup
let sessions = []
let activeUserID = ''
let activeTabID = ''
let activeContextName = ''

function addSession (userID, context, sessionID) {
  const sessionKey = `${userID}${context}`
  sessions[sessionKey] = sessionID
}

function getSessionID (userID, context) {
  const sessionKey = `${userID}${context}`
  return sessions[sessionKey]
}

// The socket.io socket
console.log(`Socket.io: connecting to ${window.location}`)
const socket = io({ path: '/karuna/socket.io' })
socket.on('connect', () => {
  console.log('[WS] Connected to server')
  socket.emit('wizardSession', {})
})

// Listen for messages from the karuna server
socket.on('updateSessions', (sessionData) => {
  console.log('[WS] Update session received')

  if (sessionData) {
    // Clear prev session tabs
    tabHeaders.empty()
    tabContents.empty()
    tabs = []
    sessions = []
    activeUserID = ''
    activeTabID = -1
    activeContextName = ''

    // Make new ones for each user and context
    let tabCount = 0
    for (const user in sessionData) {
      if (!Array.isArray(sessionData[user].contexts)) {
        console.log('User session with NO contexts ' + sessionData[user].email)
      } else {
        sessionData[user].contexts.forEach((context) => {
          const id = addTab(sessionData[user].email, context)
          addSession(sessionData[user].email, context, id)
          tabCount++

          if (tabCount === 1) {
            activeTabID = 1
            activeUserID = sessionData[user].email
            activeContextName = context
          }
        })
      }
    }

    // Are there no active valid sessions?
    if (tabCount <= 0) {
      console.log('Adding empty message')
      tabContents.append(addEmptyMessage())
    }
  }
})

socket.on('clientTyping', (message) => {
  console.log('[WS] Client typing received')

  // Lookup the session index
  const id = getSessionID(message.clientEmail, message.context)
  if (id !== undefined) {
    const typingBox = $(`#activeTyping${id}`)
    typingBox.text(message.data)
    typingBox[0].scrollTop = typingBox[0].scrollHeight
  } else {
    console.error(`Could not find session id for ${message.clientEmail}, ${message.context}`)
  }
})

socket.on('clientSend', (message) => {
  console.log('[WS] Client send received')

  // Lookup the session index
  const id = getSessionID(message.clientEmail, message.context)
  if (id !== undefined) {
    // Build and append new message entry
    const newMsg = $('<li>').addClass('clientMessage')
    newMsg.text(message.data)
    const messageBox = $(`#messageList${id}`)
    messageBox.append(newMsg)
    messageBox[0].scrollTop = messageBox[0].scrollHeight

    // Clear the typing box text
    $(`#activeTyping${id}`).text('')
  } else {
    console.error(`Could find session id for ${message.clientEmail}, ${message.context}`)
  }
})

$(document).ready(() => {
  // Retrieve critical global references
  tabHeaders = $('#tabHeader')
  tabContents = $('#tabContent')

  // Make both empty at start
  tabHeaders.empty()
  tabContents.empty()
  tabs = []

  // Make the markdown editor widget
  editor = new TinyMDE.Editor({ element: 'markdownEditor', content: ' ' })
  toolbar = new TinyMDE.CommandBar({ element: 'markdownToolbar', editor })

  // Adjust the editable div to fill its parent
  $('div.TinyMDE').css('height', '100%')
})

// A simple message to show when there are no active sessions
function addEmptyMessage () {
  const emptyPaneDiv = $('<div>').addClass('text-center')
  emptyPaneDiv.text('No active sessions')
  return emptyPaneDiv
}

// Tab element storage
let tabs = []
function tabShown (tabID, userID, contextName) {
  activeTabID = tabID
  activeUserID = userID
  activeContextName = contextName
  console.log(`New active tab: ${tabID} (${activeUserID}/${activeContextName})`)
}

// Insert a new tab at end of list
function addTab (userID, contextName) {
  // Get ID and setup 'isActive'
  const tabID = tabs.length + 1
  const isActive = (tabs.length === 0)

  // Build new header and content HTML
  const newHeader = makeTabHeader(tabID, userID, contextName, isActive, tabShown)
  const newContent = makeTabContentPane(tabID, userID, contextName, isActive)

  // Store in array for tracking
  tabs.push({
    header: newHeader,
    content: newContent
  })

  // Append to the DOM containers
  tabHeaders.append(newHeader)
  tabContents.append(newContent)

  // Set callbacks for various form-inputs
  $('.dropdown-item').on('click', cannedMessageClick)
  // $('.messageText').on('keydown', triggerMessage)
  $('#sendMessage').on('click', sendMessage)

  // Return the id
  return tabID
}

// Callback for clicking on a canned message
function cannedMessageClick (event) {
  event.preventDefault()

  const source = $(event.target)
  const dest = $(source.data('target'))
  dest.val(source.text())
}

// Enter pressed in text box, trigger send button
function triggerMessage (event) {
  // Enter key
  if (event.which === 13) {
    const submitButton = $($(event.target).data('target'))
    submitButton[0].click()
  }
}

// Send button clicked so send message in text box
function sendMessage (event) {
  event.preventDefault()

  // Retrieve message text
  const messageText = editor.getContent()

  // Refuse to send empty message
  if (messageText.trim() === '') {
    return
  }

  // Clear message text box
  editor.setContent('')

  // Build and append message to message area
  const newMsg = $('<li>').addClass('karunaMessage')
  newMsg.text(messageText)
  const messageBox = $(`#messageList${activeTabID}`)
  messageBox.append(newMsg)
  messageBox[0].scrollTop = messageBox[0].scrollHeight

  // Broadcast to all sockets
  console.log(`Broadcasting message to ${activeUserID} - ${activeContextName}`)
  socket.emit('wizardMessage', {
    clientEmail: activeUserID,
    context: activeContextName,
    content: messageText
  })
}

// Remove tab at the given index
function removeTab (index) {
  // Ensure a valid index is set (default to last tab)
  if (!index || index < 0 || index >= tabs.length) {
    index = tabs.length - 1
  }

  // Remove the indicated elements
  tabs[index].header.remove()
  tabs[index].content.remove()

  // Splice out of the array
  tabs.splice(index, 1)
}
