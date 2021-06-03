// Watson API library
import AssistantV2 from 'ibm-watson/assistant/v2.js'
import { IamAuthenticator } from 'ibm-watson/auth/index.js'

// print messages only during debug
import Debug from 'debug'

// Load data from .env file
import dotenv from 'dotenv'
dotenv.config()

// Create debug logging function
const debug = Debug('karuna:server:watson')

// Info specific to our assistant
const ASSISTANT_ROOT_SERVER = 'https://api.us-south.assistant.watson.cloud.ibm.com'
const ASSISTANT_API_ID = process.env.WATSON_ASSISTANT_UUID || 'unknown-uuid'
const ASSISTANT_VERSION = '2020-09-24'

// Create assistant API instance
const assistant = new AssistantV2({
  version: ASSISTANT_VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_ASSISTANT_API_KEY
  }),
  serviceUrl: ASSISTANT_ROOT_SERVER
})

/**
 * Create a new persistent session with watson
 * @param {string} userID Internal User ID (optional)
 * @param {string} context Chat system context: discord, MSTeams, etc. (optional)
 * @returns {Promise} Resolves to a session object to use with subsequent watson calls
 */
export function createSession (userID = '', context = '') {
  let customerID = ''
  if (userID) {
    customerID = `customer_id=${userID}${context ? '-' + context : ''}`
  }

  return new Promise((resolve, reject) => {
    debug('Creating Watson Session')
    assistant.createSession({
      assistantId: ASSISTANT_API_ID,
      headers: { 'X-Watson-Metadata': customerID }
    }).then(res => {
      resolve({
        sessionID: res.result.session_id,
        customerID
      })
    }).catch((err) => { reject(err) })
  })
}

/**
 * Delete a persistent session with watson
 * @param {Object} session The Session object returned by 'createSession'
 * @return {Promise} Resolves on successful deletion
 */
export function deleteSession (session) {
  return new Promise((resolve, reject) => {
    debug('deleting Watson Session')
    assistant.deleteSession({
      assistantId: ASSISTANT_API_ID,
      sessionId: session.sessionID,
      headers: { 'X-Watson-Metadata': session.customerID }
    }).then(res => { resolve() })
      .catch((err) => { reject(err) })
  })
}

/**
 * Send a message to Watson for analysis
 * @param {string} messageText Text of the message to analyze
 * @param {Object[]} mentions The mention array created by the Karuna extension
 * @param {Object} session The Session object returned by 'createSession'
 * @returns {Promise} Resolves on success to the analysis object from Watson
 */
export function sendMessage (messageText, mentions, session) {
  return new Promise((resolve, reject) => {
    debug('Sending message to Watson for analysis')
    // DEBUG: It seems sending 'entities' causes it to not identify any on its end
    // let entities = []
    // if (mentions) {
    //   entities = mentions.map((mention) => ({
    //     entity: 'username',
    //     location: [mention.start, mention.start + mention.value.length],
    //     value: 'mention',
    //     confidence: 1
    //   }))
    // }

    const input = {
      text: messageText
    }

    assistant.message({
      assistantId: ASSISTANT_API_ID,
      sessionId: session.sessionID,
      headers: { 'X-Watson-Metadata': session.customerID },
      input
    }).then(res => { resolve(res.result) })
      .catch((err) => { reject(err) })
  })
}
