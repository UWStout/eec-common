// Database controller interfaces
import * as DBAffect from '../mongo/affectController.js'

import * as WATSON from './watsonAssistant.js'

import { sendGenericMessage } from '../sockets.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:analysis')

const sessionMap = new Map()

// Stub function for analyzing messages (both incomplete and complete)
export async function analyzeMessage (messageObj, userID, context, isComplete = false) {
  // CAREFUL! This might be a lot.
  // if (!isComplete) { return }

  // Build customer id
  const customerID = `${userID}${context ? '-' + context : ''}`

  // Loop for sending message (might run twice)
  let retry = false
  do {
    // Create watson session if needed
    if (!sessionMap.has(customerID)) {
      if (!retry) { debug('Creating session for ' + customerID) }
      try {
        const newSession = await WATSON.createSession(userID, context)
        sessionMap.set(customerID, newSession)
      } catch (err) {
        debug('Error while creating session')
        debug(err)
        throw err
      }
    }
    retry = false

    // Attempt to analyze message
    try {
      const response = await WATSON.sendMessage(messageObj.data, messageObj.mentions, sessionMap.get(customerID))
      return response
    } catch (err) {
      if (!retry && err.message === 'Invalid Session') {
        // Clear old session and retry
        debug('Renewing expired session for ' + customerID)
        sessionMap.delete(customerID)
        retry = true
      } else {
        // Other error so throw it
        debug('Error while sending message')
        debug(err)
        throw err
      }
    }
  } while (retry)
}

// Stub function for analyzing an affect
export function analyzeAffect (affectObj, userID, context) {
  return new Promise((resolve, reject) => {
    debug(affectObj.characterCodes[0]) // when will this be called?
    // switch (affectObj.data) { // will this be an ID or an affect?
    // }

    // This is an example I want to work with to get the karuna bubble connected with the analysis engine.
    if (affectObj.characterCodes[0] === '🤩') {
      const message = 'you look excited!'
      debug(message)
      sendGenericMessage(message, userID, context)
    }
    debug('Call to analyzeAffect')
    setTimeout(() => { resolve({ success: true }) }, 100)
  })
}

// Stub function for triggering timed questions
export async function checkTimedTriggers (userInfo) {
  // Attempt to retrieve user status
  try {
    // Get most recent affect
    const lastAffect = await DBAffect.mostRecentAffectHistory(userInfo.id)

    // Check if they've never set their mood before
    if (!lastAffect?.timestamp) {
      debug('checkTimedTriggers: requesting mood from new user')
      sendGenericMessage('We need to set your mood. How are you feeling about the project today?', userInfo.id, '*', true)
    } else {
      // Compute the age of the most recent mood in hours
      const offset = (new Date()).getTimezoneOffset() * 60000
      const affectAgeHours = (Math.abs(Date.now() - lastAffect.timestamp) - offset) / 36e5

      // Is it too old?
      if (affectAgeHours > 16) {
        debug('checkTimedTriggers: mood is too old, requesting update')
        sendGenericMessage('It has been a while since you updated your mood. How are you feeling about the project today?', userInfo.id, '*', true)
      }
    }
  } catch (err) {
    debug('checkTimedTriggers: Error getting user status')
    debug(err)
  }
}
