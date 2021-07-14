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

// Create event emitter to relay some data between elements
const statusEmitter = new EventEmitter3()

// State variables
let userName = ''
let teamName = ''
let channelName = ''

jQuery(document).ready(() => {
  // Define our custom elements
  customElements.define('eec-unified', EECUnified)

  // Setup global Unified Karuna element
  const karunaUnifiedElem = document.createElement('eec-unified')
  karunaUnifiedElem.setupElementReact(contextName, statusEmitter)
  document.body.insertBefore(karunaUnifiedElem)
  karunaUnifiedElem.setBackgroundPort(extensionPort)

  // Callback function to execute when mutations are observed
  const mutationCallback = (mutationsList, observer) => {
    // Attempt to update EEC text-boxes (if needed)
    updateTextBoxes()

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

  // Send updated list of text-boxes to the unified app
  statusEmitter.emit('updateTextBoxes', textBoxes)
}
