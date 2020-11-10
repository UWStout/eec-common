/* globals $ */

// Import chat widget making button
import { makeTabHeader, makeTabContentPane } from './chatWidgetHelper.js'

// Tab content holders
let tabHeaders
let tabContents

$(document).ready(() => {
  // Retrieve critical global references
  tabHeaders = $('#tabHeader')
  tabContents = $('#tabContent')

  // Make both empty at start
  tabHeaders.empty()
  tabContents.empty()

  // Add/Remove tabs for testing
  const TIME_INTERVAL = 1500
  setTimeout(() => { addTab() }, TIME_INTERVAL * 1)
  setTimeout(() => { addTab() }, TIME_INTERVAL * 2)
  // setTimeout(() => { removeTab() }, TIME_INTERVAL * 3)
  // setTimeout(() => { addTab() }, TIME_INTERVAL * 4)
  // setTimeout(() => { addTab() }, TIME_INTERVAL * 4)
  // setTimeout(() => { addTab() }, TIME_INTERVAL * 4)
  // setTimeout(() => { removeTab(0) }, TIME_INTERVAL * 5)
  // setTimeout(() => { removeTab(-1) }, TIME_INTERVAL * 6)
  // setTimeout(() => { addTab() }, TIME_INTERVAL * 7)
  // setTimeout(() => { addTab() }, TIME_INTERVAL * 8)
  // setTimeout(() => { removeTab(3) }, TIME_INTERVAL * 9)
})

// Tab element storage
const tabs = []

// Insert a new tab at end of list
function addTab () {
  // Get ID and setup 'isActive'
  const tabID = tabs.length
  const isActive = (tabs.length === 0)

  // Build new header and content HTML
  const newHeader = makeTabHeader(tabID, `New Tab ${tabID + 1}`, isActive)
  const newContent = makeTabContentPane(tabID, isActive)

  // Store in array for tracking
  tabs.push({
    header: newHeader,
    content: newContent
  })

  // Append to the DOM containers
  tabHeaders.append(newHeader)
  tabContents.append(newContent)
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
