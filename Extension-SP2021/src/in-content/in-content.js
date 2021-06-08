/* global EventEmitter3 */

// Import our custom HTML Elements
import EECUnified from './EECUnified.jsx'

// Context enum
import { CONTEXT } from '../util/contexts.js'

// Colorful logger
import { makeLogger } from '../util/Logger.js'
const LOG = makeLogger('CONTENT Root', 'maroon', 'white')

// Avoid jQuery conflicts
$.noConflict()

// Detect current context
let contextName = 'UNKNOWN'
if (window.location.host.includes('discord')) {
  contextName = CONTEXT.DISCORD
  LOG('DISCORD DETECTED')
} else if (window.location.host.includes('teams.microsoft.')) {
  contextName = CONTEXT.MS_TEAMS
  LOG('MS TEAMS DETECTED')
} else if (window.location.host.includes('.slack.com')) {
  contextName = CONTEXT.SLACK
  LOG('SLACK DETECTED')
}

// Helpful booleans
const IS_DISCORD = (contextName === CONTEXT.DISCORD)
const IS_TEAMS = (contextName === CONTEXT.MS_TEAMS)
const IS_SLACK = (contextName === CONTEXT.SLACK)

// Initialize communication with background page
const extensionPort = chrome.runtime.connect({ name: contextName })

// Detect uncaught errors related to an invalidated extension and silence them
window.addEventListener('error', (event) => {
  if (event.error.message.includes('Extension context invalidated')) {
    event.stopImmediatePropagation()
  }
})

// Detect unloading of tab/page and send a disconnect to the communication port
window.addEventListener('beforeunload', (event) => {
  extensionPort.disconnect()
})

// Create event emitter to relay some data between elements
const statusEmitter = new EventEmitter3()

// DEBUGGING: Deal with Discord's hyper-aggressive capturing of keyboard events
document.body.addEventListener('keypress', (event) => {
  // Echo the keypress to the inner elements
  statusEmitter.emit('keypress', event)
})

// State variables
let userName = ''
let teamName = ''
let channelName = ''

jQuery(document).ready(() => {
  // Define our custom elements
  customElements.define('eec-unified', EECUnified)

  // Setup global Karuna Connect element
  const karunaUnifiedElem = document.createElement('eec-unified')
  karunaUnifiedElem.setupElementReact(contextName, statusEmitter)
  document.body.insertBefore(karunaUnifiedElem)
  karunaUnifiedElem.setBackgroundPort(extensionPort)

  // Callback function to execute when mutations are observed
  const mutationCallback = (mutationsList, observer) => {
    // Attempt to update EEC text-boxes (if needed)
    updateTextBoxes()

    // Signal that content has changed to the connect component
    karunaUnifiedElem.onMutation()

    // Check team and channel names on any page mutation.
    // We use optional chaining to avoid undefined errors
    const oldValues = { userName, teamName, channelName }
    if (IS_TEAMS) {
      userName = jQuery('img.user-picture')?.first()?.attr('upn')?.trim()
      teamName = jQuery('.team-icon')?.attr('alt')?.substr(19)?.trim()
      channelName = jQuery('.channel-name')?.text()?.trim()
      if (teamName) { teamName = teamName.substr(0, teamName.length - 1) }
    } else if (IS_DISCORD) {
      const userArea = jQuery('section[aria-label="User area"]')
      userName = userArea.text()?.trim()
      teamName = userArea?.parent()?.children()?.first()?.children()?.first()?.text()?.trim()
      channelName = document.title?.trim()
    } else if (IS_SLACK) {
      userName = jQuery('[data-qa="channel_sidebar_name_you"]')?.parent()?.children()?.first()?.text()?.trim()
      teamName = jQuery('.p-ia__sidebar_header__team_name_text')?.text()?.trim()
      channelName = jQuery('[data-qa="channel_name"]')?.text()?.trim()
    }

    // Did something change?
    if (oldValues.userName !== userName || oldValues.teamName !== teamName || oldValues.channelName !== channelName) {
      // Print updated context info
      LOG(`context updated: ${contextName}, ${teamName}/${channelName}/${userName}`)

      // Update data in the background script
      chrome.runtime.sendMessage({ type: 'context', userName, teamName, channelName, context: contextName })
    }
  }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(mutationCallback)

  // Start observing the target node for configured mutations
  observer.observe(document.body, { childList: true, subtree: true })
})

// Track and inject the extension for each text-box
const EECMessageTextModuleList = new Map()
function updateTextBoxes () {
  // Get all text-box elements
  let textBoxes
  if (IS_DISCORD) {
    // Any element with the property 'data-slate-editor'
    textBoxes = document.querySelectorAll('[data-slate-editor]')
  } else if (IS_TEAMS || IS_SLACK) {
    // Any element with the role 'textbox'
    textBoxes = document.querySelectorAll('[role="textbox"]')
  }

  // Loop over each text-box and install an extension element
  // for it if one does not already exist.
  textBoxes.forEach((textBox) => {
    let key = textBox
    if (IS_DISCORD) {
      key = textBox.getAttribute('aria-label')
    }
    if (!EECMessageTextModuleList.has(key)) {
      LOG(`Adding New EEC Message Text Module (${EECMessageTextModuleList.size + 1} added)`)

      // Build in-line extension
      const messageTextModuleElem = document.createElement('eec-message-text-module')
      messageTextModuleElem.setStatusEmitter(statusEmitter)
      messageTextModuleElem.contextName = contextName
      messageTextModuleElem.setBackgroundPort(extensionPort)
      messageTextModuleElem.setTextBox(textBox)

      // Insert it and add to lookup map
      textBox.parentNode.insertBefore(messageTextModuleElem, textBox.nextSibling)
      EECMessageTextModuleList.set(key, messageTextModuleElem)
    }
  })
}
