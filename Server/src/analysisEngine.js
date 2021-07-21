
// Setup debug for output
import Debug from 'debug'

import * as WATSON from './watsonAssistant.js'

import { sendGenericMessage } from './sockets.js'

const analysisDebug = Debug('karuna:server:analysis')

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
      if (!retry) { analysisDebug('Creating session for ' + customerID) }
      try {
        const newSession = await WATSON.createSession(userID, context)
        sessionMap.set(customerID, newSession)
      } catch (err) {
        analysisDebug('Error while creating session')
        analysisDebug(err)
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
        analysisDebug('Renewing expired session for ' + customerID)
        sessionMap.delete(customerID)
        retry = true
      } else {
        // Other error so throw it
        analysisDebug('Error while sending message')
        analysisDebug(err)
        throw err
      }
    }
  } while (retry)
}

// Stub function for analyzing an affect
export function analyzeAffect (affectObj, userID, context) {
  return new Promise((resolve, reject) => {
    analysisDebug(affectObj.characterCodes[0]) // when will this be called?
    // switch (affectObj.data) { // will this be an ID or an affect?
    // }

    // This is an example I want to work with to get the karuna bubble connected with the analysis engine.
    if (affectObj.characterCodes[0] === '🤩') {
      const message = 'you look excited!'
      analysisDebug(message)
      sendGenericMessage(message, userID, context)
    }
    analysisDebug('Call to analyzeAffect')
    setTimeout(() => { resolve({ success: true }) }, 100)
  })
}

// Stub function for triggering timed questions
export function checkTimedTriggers (userInfo) {
  return new Promise((resolve, reject) => {
    analysisDebug('Call to check timed triggers')
    setTimeout(() => { resolve({ success: true }) }, 100)
  })
}
