/* globals $, axios, store, Cookies, io, TinyMDE */

// Import various helper functions
import { makeTabHeader, makeTabContentPane } from './chatWidgetHelper.js'
import { makeMessageGroup } from './cannedMessagesSidebar.js'

// Tab content holders
let tabHeaders
let tabContents

// The markdown editor elements
let editor
let toolbar

// Session lookup
const sessions = []
let activeUserID = ''
let activeTabID = ''
let activeContextName = ''

function makeSessionKey (userID, context) {
  if (!context) { return userID }
  return `${userID}-${context}`
}

function addSession (userID, context, sessionID) {
  const sessionKey = makeSessionKey(userID, context)
  sessions[sessionKey] = {
    tabID: sessionID,
    active: true,
    userID,
    context
  }
}

function getSession (userID, context) {
  const sessionKey = makeSessionKey(userID, context)
  return sessions[sessionKey]
}

// The socket.io socket
console.log(`Socket.io: connecting to ${window.location}`)
const socket = io({ path: '/karuna/socket.io' })
socket.on('connect', () => {
  const token = store.local.get('JWT') || Cookies.get('JWT')
  console.log('[WS] Connected to server')
  socket.emit('wizardSession', { token })
})

// Listen for messages from the karuna server
socket.on('updateSessions', (sessionData) => {
  console.log('[WS] Update session received')

  if (sessionData) {
    // Clear prev session tabs
    removeEmptyMessage()
    // tabHeaders.empty()
    // tabContents.empty()
    // tabs = []
    // sessions = []
    // activeUserID = ''
    // activeTabID = -1
    // activeContextName = ''

    // Previous session IDs
    const prevSessions = Object.keys(sessions)
    let isFirstSession = (prevSessions.length === 0)

    // Make new ones for each user and context
    for (const user in sessionData) {
      if (!Array.isArray(sessionData[user].contexts)) {
        console.log('User session with NO contexts ' + sessionData[user].email)
      } else {
        sessionData[user].contexts.forEach((context) => {
          if (getSession(sessionData[user].email, context)?.tabID === undefined) {
            // New session
            const id = addTab(sessionData[user].email, context)
            addSession(sessionData[user].email, context, id)

            // When this is the very first session, make it active
            if (isFirstSession) {
              activeTabID = 1
              activeUserID = sessionData[user].email
              activeContextName = context
              isFirstSession = false
            }
          } else {
            // Session is still active
            const index = prevSessions.indexOf(makeSessionKey(sessionData[user].email, context))
            if (index >= 0) { prevSessions.splice(index, 1) }

            // Reactivate an old session if necessary
            if (!getSession(sessionData[user].email, context).active) {
              getSession(sessionData[user].email, context).active = true
              activateTab(getSession(sessionData[user].email, context).tabID)
            }
          }
        })
      }
    }

    // Any lingering prev sessions that are no longer active?
    prevSessions.forEach((sessionID) => {
      deactivateTab(getSession(sessionID)?.tabID)
      getSession(sessionID).active = false

      // Update send button state
      if (getSession(sessionID)?.tabID === activeTabID) {
        setSendButtonActive(false)
      }
    })

    // Are there no active valid sessions?
    if (Object.keys(sessions).length <= 0) {
      tabContents.append(makeEmptyMessage())
      setSendButtonActive(false, 'No sessions')
    } else {
      setSendButtonActive(true)
    }
  }
})

socket.on('clientTyping', (message) => {
  console.log('[WS] Client typing received')

  // Lookup the session index
  const id = getSession(message.clientEmail, message.context)?.tabID
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
  const id = getSession(message.clientEmail, message.context)?.tabID
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

let lastSelection = null
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

  // Listen for selection events
  editor.addEventListener('selection', (selection) => {
    lastSelection = selection
  })

  // Adjust the editable div to fill its parent
  $('div.TinyMDE').css('height', '100%')

  // Setup page callbacks
  $('#sendMessage').on('click', sendMessage)

  // Load data for canned messages and prepare to construct sidebar
  axios.get('./cannedMessages.json')
    .then((response) => { buildMessagesSidebar(response.data) })
    .catch((err) => {
      window.alert('WARNING: There was an error reading the data for the canned messages.')
      console.error('Failed to read messages json')
      console.error(err)
    })
})

function buildMessagesSidebar (data) {
  // Loop over return groups
  data.forEach((group, i) => {
    // Build and append each group of choices
    const groupNodes = makeMessageGroup(
      i + 1, cannedMessageClick, 'cannedMessageSidebar', group.header, group.choices
    )
    $('#cannedMessageSidebar').append(groupNodes)
  })

  // TODO: Append command choices

  // TODO: Append wizard history group
}

// A simple message to show when there are no active sessions
function makeEmptyMessage () {
  const emptyPaneDiv = $('<div>').attr('id', 'emptyMessageDiv').addClass('text-center')
  emptyPaneDiv.text('No active sessions')
  return emptyPaneDiv
}

function removeEmptyMessage () {
  $('#emptyMessageDiv').remove()
}

// Tab element storage
let tabs = []
function tabShown (tabID, userID, contextName) {
  activeTabID = tabID
  activeUserID = userID
  activeContextName = contextName
  console.log(`New active tab: ${tabID} (${activeUserID}/${activeContextName})`)

  setSendButtonActive(getSession(userID, contextName).active)
}

function setSendButtonActive (isActive, inactiveText = 'session is not active') {
  if (!isActive) {
    $('#sendMessage').attr('disabled', true).addClass('disabled')
    $('#sendMessage').text(inactiveText)
  } else {
    $('#sendMessage').removeAttr('disabled').removeClass('disabled')
    $('#sendMessage').text('Send')
  }
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
  // $('.dropdown-item').on('click', cannedMessageClick)
  // $('.messageText').on('keydown', triggerMessage)

  // Return the id
  return tabID
}

function activateTab (tabID) {
  console.log(`Activating tab ${tabID}`)
  // Strike through tab text
  $(`#tab${tabID}`).css('text-decoration', '')
}

function deactivateTab (tabID) {
  console.log(`Removing tab ${tabID}`)
  // Strike through tab text
  $(`#tab${tabID}`).css('text-decoration', 'line-through')
}

// Callback for clicking on a canned message
function cannedMessageClick (event) {
  // Prevent default behavior and get reference to list item element
  event.preventDefault()
  const source = $(event.target)

  // Send message to editor
  if (source.data('overwrite')) {
    // Overwrite contents of editor
    editor.setContent(source.data('message'))
  } else {
    // Insert/paste message into editor
    editor.paste(source.data('message'), lastSelection.anchor, lastSelection.focus)
  }
}

// NOTE: Disabled for now
// Enter pressed in text box, trigger send button
// function triggerMessage (event) {
//   // Enter key
//   if (event.which === 13) {
//     const submitButton = $($(event.target).data('target'))
//     submitButton[0].click()
//   }
// }

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
// function removeTab (index) {
//   // Ensure a valid index is set (default to last tab)
//   if (!index || index < 0 || index >= tabs.length) {
//     index = tabs.length - 1
//   }

//   // Remove the indicated elements
//   tabs[index].header.remove()
//   tabs[index].content.remove()

//   // Splice out of the array
//   tabs.splice(index, 1)
// }
