// Bring in context strings
import { CONTEXT } from '../util/contexts.js'

// Context specific filter details
import * as DISCORD from './requestFilters/DiscordFilters.js'
import * as MS_TEAMS from './requestFilters/MSTeamsFilters.js'
import * as SLACK from './requestFilters/SlackFilters.js'

/**
 * Install the listeners globally. All chrome messages that match the filters used
 * will be intercepted but not blocked.
 * @see {@link https://developer.chrome.com/extensions/webRequest}
 */
export function setupWebRequests () {
  // Listen for all websocket & xhr messages to the discord server
  chrome.webRequest.onBeforeRequest.addListener(
    DISCORD.listener, DISCORD.filters, ['blocking', 'requestBody']
  )

  // Listen for all websocket & xhr messages to the teams server
  chrome.webRequest.onBeforeRequest.addListener(
    MS_TEAMS.listener, MS_TEAMS.filters, ['blocking', 'requestBody']
  )

  // Listen for all websocket & xhr messages to the slack server
  chrome.webRequest.onBeforeRequest.addListener(
    SLACK.listener, SLACK.filters, ['blocking', 'requestBody']
  )
}

/**
 * Install a WebRequest listener for a specific tab. Will assume it is the indicated
 * context and only listen for events based on that.
 * @param {number} tabID A valid integer id for a chrome tab to monitor
 * @param {string} context The chat tool context (one of the strings in util/contexts.js)
 */
export function listenToTab (tabID, context) {
  switch (context) {
    case CONTEXT.MS_TEAMS:
      chrome.webRequest.onBeforeRequest.addListener(
        MS_TEAMS.listener, { tab: tabID, ...MS_TEAMS.filters }, ['blocking', 'requestBody']
      )
      break

    case CONTEXT.DISCORD:
      chrome.webRequest.onBeforeRequest.addListener(
        DISCORD.listener, { tab: tabID, ...DISCORD.filters }, ['blocking', 'requestBody']
      )
      break

    case CONTEXT.SLACK:
      chrome.webRequest.onBeforeRequest.addListener(
        SLACK.listener, { tab: tabID, ...SLACK.filters }, ['blocking', 'requestBody']
      )
      break

    default:
      console.log(`[BACKGROUND] Unknown context while installing WebRequest listener (${context})`)
  }
}
