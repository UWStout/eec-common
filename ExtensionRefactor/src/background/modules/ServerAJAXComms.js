// Library for easy AJAX requests
import Axios from 'axios'

// Server config
import * as SERVER_CONFIG from '../../util/serverConfig.js'

// Helper functions
import { retrieveUser, retrieveToken } from './DataStorage.js'

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
      if (!userData.id) {
        promise = Promise.reject(new Error('No user id available (not logged in?)'))
      } else {
        promise = getUserStatus(userData.id)
      }
      break

    case 'ajax-setUserAffect':
      if (!userData.id) {
        promise = Promise.reject(new Error('No user id available (not logged in?)'))
      } else {
        promise = setUserAffect(userData.id, message.affectID, message.privacy)
      }
      break

    case 'ajax-setCollaboration':
      if (!userData.id) {
        promise = Promise.reject(new Error('No user id available (not logged in?)'))
      } else {
        promise = setCollaboration(userData.id, message.collaboration)
      }
      break

    case 'ajax-setTimeToRespond':
      if (!userData.id) {
        promise = Promise.reject(new Error('No user id available (not logged in?)'))
      } else {
        promise = setTimeToRespond(userData.id, message.timeToRespond)
      }
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

// Construct and return a header object containing the JWT for use with AXIOS
function authorizationHeader () {
  return {
    Authorization: `digest ${retrieveToken()}`
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
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}affect/list?fullInfo&perPage=500`, config)

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
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}user/status/${userID}`, config)
    requestPromise.then((response) => {
      return resolve(response.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function setUserAffect (userID, affectID, isPrivate) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}affect/insertHistory`,
      { userID, affectID, isPrivate },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setCollaboration (userID, collaborationStatus) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}user/collaboration`,
      { userID, collaborationStatus },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setTimeToRespond (userID, timeToRespond) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}user/timeToRespond`,
      { userID, timeToRespond },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}
