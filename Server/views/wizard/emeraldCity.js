/* globals $, axios, store, Cookies, io, TinyMDE */

// Import various helper functions
import { makeTabHeader, makeTabContentPane } from './chatWidgetHelper.js'
import { makeMessageGroup, appendAffectList } from './cannedMessagesSidebar.js'

// Repo read-only token
// - This is a personal access token for github account KarunaAuth
// - This account has read-only access to eec-common and nothing else
// - CAUTION: This is sent to and used by any clients that access emeraldCity.html
//            so do NOT increase the access rights of this account!
const EEC_READ_TOKEN = 'cd275b3f7220416a7b68368d84e58586da6381f2'

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

    // is this where "word-triggered" karuna responses should happen?

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
    // Cache the most recent, non-null selection object
    if (selection && selection.focus) {
      lastSelection = selection
    }
  })

  // Adjust the editable div to fill its parent
  $('div.TinyMDE').css('height', '100%')

  // Setup page callbacks
  $('#sendMessage').on('click', sendMessage)
  $('#markdownEditor').on('keypress', checkEnterClick)

  function checkEnterClick (e) {
    if (isSendButtonActive()) {
      // editor.setContent('')
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      } else if (e.keyCode === 13) {
        sendMessage()
      }
    }
  }

  // Try to load LATEST canned data from repo
  const headers = {
    Authorization: `token ${EEC_READ_TOKEN}`,
    Accept: 'application/vnd.github.v3.raw'
  }

  // Grab latest version
  axios.get('https://api.github.com/repos/UWStout/eec-common/contents/Server/views/wizard/cannedMessages.json', { headers }, 'json')
    .then((response) => {
      console.log('Loading latest cannedMessages.json from Github')
      buildMessagesSidebar(response.data)
    })
    .catch((err) => {
      // Log the error and try fallback
      console.error('Failed to load github canned messages, falling back to local copy (may be out of date)')
      console.error(err)

      // this is where I should try to talk to the JSON object, but not write to it.

      // Fall back to local version of canned messages
      axios.get('./cannedMessages.json')
        .then((response) => { buildMessagesSidebar(response.data) })
        .catch((err) => {
          window.alert('WARNING: There was an error reading the canned messages.')
          console.error('Failed to read messages json')
          console.error(err)
        })
    })
})

async function buildMessagesSidebar (data) {
  // Loop over return groups
  data = await appendAffectList(data)
  data.forEach((group, i) => {
    // Build and append each group of choices
    const groupNodes = makeMessageGroup(
      i + 1, cannedMessageClick, 'cannedMessageSidebar', group.header, group.choices
    )
    $('#cannedMessageSidebar').append(groupNodes)
  })

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

// will this work??
function isSendButtonActive () {
  return !$('#sendMessage').attr('disabled')
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
    if (!lastSelection) {
      editor.paste(source.data('message'))
    } else {
      editor.paste(source.data('message'), lastSelection.anchor, lastSelection.focus)
    }
  }
}

// Send button clicked so send message in text box
function sendMessage (event) {
  if (event) {
    event.preventDefault()
  }
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
