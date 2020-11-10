/* globals $, io */

// Import chat widget making button
import { makeTabHeader, makeTabContentPane } from './chatWidgetHelper.js'

// Tab content holders
let tabHeaders
let tabContents

// Session lookup
const sessions = []

// The socket.io socket
const socket = io()
socket.on('connect', () => {
  socket.emit('wizardSession', {})
})

// Listen for messages from the karuna server
socket.on('updateSessions', (sessionData) => {
  console.log('[WS] update session received')
  console.log(sessionData)
  if (sessionData) {
    // Clear prev session tabs
    tabHeaders.empty()
    tabContents.empty()

    // Make new ones for each session
    for (const user in sessionData) {
      const id = addTab(sessionData[user].email)
      sessions[sessionData[user].email] = id
    }
  }
})

socket.on('clientTyping', (data) => {
  // Lookup the session index
  const id = sessions[data.clientEmail]
  if (id) {
    $(`#activeTyping${id}`).text(data.typing)
  }
})

socket.on('clientSend', (data) => {
  // Lookup the session index
  const id = sessions[data.clientEmail]
  if (id) {
    $(`#messageList${id}`).append($('<li>').text(data.message))
  }
})

$(document).ready(() => {
  // Retrieve critical global references
  tabHeaders = $('#tabHeader')
  tabContents = $('#tabContent')

  // Make both empty at start
  tabHeaders.empty()
  tabContents.empty()
})

// Tab element storage
const tabs = []

// Insert a new tab at end of list
function addTab (tabName) {
  // Get ID and setup 'isActive'
  const tabID = tabs.length
  const isActive = (tabs.length === 0)

  // Default tab name
  tabName = tabName || `Tab ${tabID + 1}`

  // Build new header and content HTML
  const newHeader = makeTabHeader(tabID, tabName, isActive)
  const newContent = makeTabContentPane(tabID, isActive)

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
