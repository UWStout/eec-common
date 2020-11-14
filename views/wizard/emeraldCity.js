/* globals $, io */

// Import chat widget making button
import { makeTabHeader, makeTabContentPane } from './chatWidgetHelper.js'

// Tab content holders
let tabHeaders
let tabContents

// Session lookup
let sessions = []
let activeTabIndex = -1

// The socket.io socket
const socket = io()
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

    // Make new ones for each session
    for (const user in sessionData) {
      const id = addTab(sessionData[user].email)
      sessions[sessionData[user].email] = id
    }
  }
})

socket.on('clientTyping', (data) => {
  console.log('[WS] Client typing received')

  // Lookup the session index
  const id = sessions[data.clientEmail]
  if (id !== undefined) {
    const typingBox = $(`#activeTyping${id}`)
    typingBox.text(data.typing)
    typingBox[0].scrollTop = typingBox[0].scrollHeight
  }
})

socket.on('clientSend', (data) => {
  console.log('[WS] Client send received')

  // Lookup the session index
  const id = sessions[data.clientEmail]
  if (id !== undefined) {
    // Build and append new message entry
    const newMsg = $('<li>').addClass('clientMessage')
    newMsg.text(data.message)
    const messageBox = $(`#messageList${id}`)
    messageBox.append(newMsg)
    messageBox[0].scrollTop = messageBox[0].scrollHeight

    // Clear the typing box text
    $(`#activeTyping${id}`).text('')
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
})

// Tab element storage
let tabs = []

// Insert a new tab at end of list
function addTab (tabName) {
  // Get ID and setup 'isActive'
  const tabID = tabs.length + 1
  const isActive = (tabs.length === 0)

  // Default tab name
  tabName = tabName || `Tab ${tabID}`

  // Build new header and content HTML
  const newHeader = makeTabHeader(tabID, tabName, isActive)
  const newContent = makeTabContentPane(tabID, tabName, isActive)

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
  $('.messageText').on('keydown', triggerMessage)
  $('.sendMessage').on('click', sendMessage)

  // Calback for active tab changing
  $('a[data-toggle="tab"]').on('shown.bs.tab', updateActiveTab)
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
  const sendButton = $(event.target)
  const source = $(sendButton.data('source'))
  const messageText = source.val()

  // Refuse to send empty message
  if (messageText.trim() === '') {
    return
  }

  // Clear message text box
  source.val('')

  // Build and append message to message area
  const newMsg = $('<li>').addClass('karunaMessage')
  newMsg.text(messageText)
  const messageBox = $(sendButton.data('target'))
  messageBox.append(newMsg)
  messageBox[0].scrollTop = messageBox[0].scrollHeight

  // Broadcast to all sockets
  console.log(`Broadcasting message to ${sendButton.data('client')}`)
  socket.emit('wizardMessage', {
    clientEmail: sendButton.data('client'),
    content: messageText
  })
}

// Keep track of the currently active tab
function updateActiveTab (event) {
  activeTabIndex = $(event.target).attr('id').substring(3)
  activeTabIndex = parseInt(activeTabIndex) - 1
  console.log('Active tab is ' + activeTabIndex)
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
