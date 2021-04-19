
// Setup debug for output
import Debug from 'debug'

import { sendGenericMessage } from './sockets.js'

const debug = Debug('server:analysis')

// Stub function for analyzing messages (both incomplete and complete)
export function analyzeMessage (messageObj, isComplete = false) {
  return new Promise((resolve, reject) => {
    // debug(messageObj.data) // where the message is stored

    // These are the options from the Miro docs that I found
    switch (messageObj.data) {
      case 'I feel frustrated':
      case 'I feel upset':
      case 'WTF':
      case 'I feel (input)': // make additional case statements for faux feelings?
      case 'not responding': // obviously not an actual message, probably related to viewing the other user's message but not responding
        resolve({ karunaResponse: 'do you want to update your affect?' })
    }
    debug('Call to analyzeMessage')
    setTimeout(() => { resolve({ success: true }) }, 100)
  })
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
export function checkTimedTriggers (userInfo) {
  return new Promise((resolve, reject) => {
    debug('Call to check timed triggers')
    setTimeout(() => { resolve({ success: true }) }, 100)
  })
}