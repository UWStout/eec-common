// Setup debug for output
import Debug from 'debug'
const debug = Debug('server:analysis')

// Stub function for analyzing messages (both incomplete and complete)
export function analyzeMessage (messageObj, isComplete = false) {
  return new Promise((resolve, reject) => {
    debug('Call to analyzeMessage')
    setTimeout(() => { resolve({ success: true }) }, 100)
  })
}

// Stub function for analyzing an affect
export function analyzeAffect (affectObj) {
  return new Promise((resolve, reject) => {
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
