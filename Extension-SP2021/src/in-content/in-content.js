/* global EventEmitter3 */

// Import our custom HTML Elements
import EECUnified from './EECUnified.jsx'

// Context enum
import { CONTEXT } from '../util/contexts.js'

import store from 'store2'

// Colorful logger
import { makeLogger } from '../util/Logger.js'
const LOG = makeLogger('CONTENT Root', 'maroon', 'white')

// Enable/disable the teams 'r' and 'c' key tunneling
const ENABLE_TEAMS_TUNNEL = false

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

// Has karuna been mounted yet
let karunaIsMounted = false

// Initialize communication with background page
const extensionPort = chrome.runtime.connect({ name: contextName })

// Create event emitter to relay some data between elements
const statusEmitter = new EventEmitter3()

// State variables
let userName = ''
let userAppId = ''
let teamName = ''
let channelName = ''
let avatarSrc = ''
let siteCookies = null

jQuery(document).ready(() => {
  // Read and decode the site cookies
  updateCookies()

  // Define our custom elements
  customElements.define('eec-unified', EECUnified)

  // Add the mutation observer
  setupMutationObserver()
})

function setupMutationObserver () {
  // Callback function to execute when mutations are observed
  const mutationCallback = (mutationsList, observer) => {
    // Wait until the page is truely done loading before proceeding
    if (!karunaIsMounted) {
      if (IS_TEAMS) {
        if (!document.querySelector('.ts-waffle')) {
          // Page isn't ready yet
          return
        }
      } else if (IS_DISCORD) {
        if (!document.querySelector('[data-list-item-id="guildsnav___home"]')) {
          // Page isn't ready yet
          return
        }
      } // TODO: Add a slack check for readiness

      // Page is ready so fully mount
      karunaIsMounted = true
      mountKaruna()
    }

    // Attempt to update EEC text-boxes (if needed)
    updateTextBoxes()

    // Search for and update list of alias' on the page
    updateAliasList()

    // Check team and channel names on any page mutation.
    // We use optional chaining to avoid undefined errors
    const oldValues = { userName, userAppId, teamName, channelName, avatarSrc }
    if (IS_TEAMS) {
      userName = jQuery('img.user-picture')?.first()?.attr('upn')?.trim()
      teamName = jQuery('.team-icon')?.attr('alt')?.substr(19)?.trim()
      channelName = jQuery('.channel-name')?.text()?.trim()
      if (teamName) { teamName = teamName.substr(0, teamName.length - 1) }
      userAppId = getAppId()
      avatarSrc = `https://teams.microsoft.com/api/mt/amer/beta/users/8:orgid:${userAppId}/profilepicturev2?size=HR42x42`
    } else if (IS_DISCORD) {
      const userArea = jQuery('section[aria-label="User area"]')
      userName = userArea.text()?.trim()
      teamName = userArea?.parent()?.children()?.first()?.children()?.first()?.text()?.trim()
      channelName = document.title?.trim()
      userAppId = getAppId()
      avatarSrc = jQuery('div[class*="avatarWrapper"] img[class*="avatar"]')?.attr('src')
    } else if (IS_SLACK) {
      userName = jQuery('[data-qa="channel_sidebar_name_you"]')?.parent()?.children()?.first()?.text()?.trim()
      teamName = jQuery('.p-ia__sidebar_header__team_name_text')?.text()?.trim()
      channelName = jQuery('[data-qa="channel_name"]')?.text()?.trim()
    }

    // Did something change?
    if (oldValues.userName !== userName || oldValues.userAppId !== userAppId || oldValues.teamName !== teamName || oldValues.channelName !== channelName || oldValues.avatarSrc !== avatarSrc) {
      // Print updated context info
      LOG(`context updated: ${contextName}, ${teamName}/${channelName}/${userName} (${userAppId} / ${avatarSrc})`)

      // Update data in the background script
      chrome.runtime.sendMessage({ type: 'context', userName, userAppId, teamName, channelName, avatarSrc, context: contextName })
    }
  }

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(mutationCallback)

  // Start observing the target node for configured mutations
  observer.observe(document.body, { childList: true, subtree: true })
}

function mountKaruna () {
  // Setup global Unified Karuna element
  const karunaUnifiedElem = document.createElement('eec-unified')
  karunaUnifiedElem.setupElementReact(contextName, statusEmitter)
  karunaUnifiedElem.setBackgroundPort(extensionPort)

  // Wrap the unified karuna element with an ARIA role
  const karunaWrapper = document.createElement('div')
  karunaWrapper.setAttribute('role', 'region')
  karunaWrapper.setAttribute('aria-label', 'The Karuna browser extension')
  karunaWrapper.appendChild(karunaUnifiedElem)
  document.body.insertBefore(karunaWrapper)

  // DISCORD: Prevent focus stealing and keyboard input stealing
  if (IS_DISCORD) {
    // Disabled for now / Breaks mentions in discord (Seems to not be needed)
    // document.addEventListener('focusin', (e) => {
    //   if (e.target.hasAttribute('data-slate-editor')) {
    //     LOG('PREVENTING FOCUS STEALING', e)
    //     e.stopPropagation()
    //   }
    // }, true)

    // This works okay and allows typing in our text fields
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        // Pass along to extension as a 'submit' event
        if (statusEmitter) {
          statusEmitter.emit('submitRequested')
        }
      } else {
        e.stopImmediatePropagation()
      }
    }, true)
  }

  // TEAMS: try and capture and re-broadcast the 'r' and 'c' keys
  if (IS_TEAMS && ENABLE_TEAMS_TUNNEL) {
    const tunnelKey = (e) => {
      if (e.key === 'r' || e.key === 'c') {
        if (statusEmitter) {
          statusEmitter.emit('tunnel-key', { type: e.type, key: e.key })
        }
      }
    }
    window.addEventListener('keydown', tunnelKey, true)
  }
}

function updateCookies () {
  const cookies = {}
  decodeURIComponent(document.cookie).split('; ').forEach((cookieStr) => {
    const index = cookieStr.indexOf('=')
    cookies[cookieStr.substr(0, index)] = cookieStr.substr(index + 1)
  })
  siteCookies = cookies
}

function getAppId () {
  if (IS_TEAMS) {
    // Decode the Teams JWT
    const token = siteCookies?.TSAUTHCOOKIE
    if (typeof token !== 'string' || token.split('.').length < 2) {
      return null
    }
    const payload = JSON.parse(atob(token.split('.')[1]))

    // Return the Teams OrgID
    return payload.oid
  } else if (IS_DISCORD) {
    return store.local.get('user_id_cache')
  }

  return null
}

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

function updateAliasList () {
  const aliasList = new Set()
  if (IS_TEAMS) {
    const nodeList = document.querySelectorAll('img.media-object[src*="/profilepicture"]')
    nodeList.forEach((node) => {
      const match = node.src.match(/orgid:(.*)\/profilepicture/i)
      if (Array.isArray(match) && match.length > 1) {
        if (!aliasList.has(match[1])) { aliasList.add(match[1]) }
      }
    })
  } else if (IS_DISCORD) {
    const nodeList = document.querySelectorAll('img[class*="avatar"]')
    nodeList.forEach((node) => {
      const match = node.src.match(/avatars\/(.*)\//i)
      if (Array.isArray(match) && match.length > 1) {
        if (!aliasList.has(match[1])) { aliasList.add(match[1]) }
      }
    })
  }
}
