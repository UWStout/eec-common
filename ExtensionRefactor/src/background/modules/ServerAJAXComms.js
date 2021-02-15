// Library for easy AJAX requests
import Axios from 'axios'

// Server config
import * as SERVER_CONFIG from '../../util/serverConfig.js'

// Helper functions
import { retrieveUser } from './DataStorage.js'

export function processAjaxRequest (message, resolve, reject, sendResponse) {
  // Lookup user data (may need it later)
  const userData = retrieveUser()

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
      promise = getUserStatus(userData.id)
      break

    case 'ajax-setUserAffect':
      promise = setUserAffect(userData.id, message.affectID)
      break

    case 'ajax-setCollaboration':
      promise = setCollaboration(userData.id, message.collaboration)
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
      const emojiList = response.data.data
      resolve(emojiList)
    })
    requestPromise.catch((error) => { reject(error) })
  })
}

function getUserStatus (userID) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}test/getUserStatus/${userID}`)
    requestPromise.then((response) => {
      return resolve(response.data.userStatus)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function setUserAffect (userID, affectID) {
  return Promise.resolve()
}

function setCollaboration (userID, newCollaboration) {
  return Promise.resolve()
}
