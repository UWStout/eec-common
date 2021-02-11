// Library for easy AJAX requests
import Axios from 'axios'

// Server config
import * as SERVER_CONFIG from '../../util/serverConfig.js'

export function processAjaxRequest (message, resolve, reject, sendResponse) {
  // Route request to the proper function
  let promise = null
  switch (message.type) {
    case 'ajax-validateAccount':
      promise = validateAccount(message.email, message.password)
      break

    case 'ajax-getEmojiList':
      promise = getEmojiList()
      break

    case 'ajax-getUserStatus':
      promise = getUserStatus(message.userID)
      break

    default: {
      console.log('Unknown ajax message:')
      console.log(message)
      const error = new Error('Unknown ajax-request type: ' + message.type)
      reject(error)
      sendResponse({ error })
      return
    }
  }

  // Hook up promise to relay back to request sender
  if (promise) {
    promise.then((data) => { resolve(data); sendResponse(data) })
    promise.catch((error) => { reject(error); sendResponse({ error }) })
  }
}

function validateAccount (email, password) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}auth/login`,
      { email: email, password: password }
    )

    // Listen for server response or error
    requestPromise.then((response) => { resolve(response.data) })
    requestPromise.catch((error) => { reject(error) })
  })
}

function getEmojiList () {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}test/listAffects?fullInfo&perPage=35`)

    // Listen for server response or error
    requestPromise.then((response) => {
      const emojiList = response.data.data.map((entry) => {
        return { name: entry.name, emoji: entry.characterCodes[0] }
      })
      resolve(emojiList)
    })
    requestPromise.catch((error) => { reject(error) })
  })
}

// NOTE
// To put a stub rejection in:
// return Promise.reject(new Error('Not yet implemented'))

function getUserStatus (userID) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}test/getUserStatus/${userID}`)
    requestPromise.then((response) => { // listen for server response
      const userStatus = response.data.userStatus

      // Make second request from server to get affect log entry
      if (userStatus.affectLogID) {
        const affectLogID = userStatus.affectLogID
        const affectLogPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}test/listAffectHistory/affectLogID/${affectLogID}`)
        affectLogPromise.then((response2) => { // listen for server response
          const affectID = response.data.affectID

          // Make third request from server to get affect data from affectID
          const affectPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}test/getAffectDetails/${affectID}`)
          affectPromise.then((response3) => {
            // Build the status object and resolve with it
            return resolve({
              collaboration: userStatus.lastCollaborationStatus || 'unknown',
              recentAffect: response3.affect,
              timeToRespondMinutes: userStatus.minutesToRespond || -1
            })
          })
          // Reject on error from the third request (request to get affect from affectID)
          affectPromise.catch((error) => { return reject(error) })
        })
        // Reject on error from second request (request to get affectLog from affectLogID)
        affectLogPromise.catch((error) => { return reject(error) })
      } else {
        return resolve({
          collaboration: userStatus.lastCollaborationStatus || 'unknown',
          recentAffect: null,
          timeToRespondMinutes: userStatus.minutesToRespond || -1
        })
      }
      // Reject on error from the first request (request to get user status)
      requestPromise.catch((error) => { return reject(error) })
    })
  })
}
