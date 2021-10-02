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
      promise = validateAccount(message.email, message.password, message.expiration, message.context)
      break

    case 'ajax-getEmojiList':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getEmojiList()
      }
      break

    case 'ajax-fullUserInfo':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getFullUserInfo(userData.id)
      }
      break

    case 'ajax-karunaSettings':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getKarunaSettings()
      }
      break

    case 'ajax-setKarunaSettings':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = setKarunaSettings(message.karunaSettings)
      }
      break

    case 'ajax-lookupAliasIds':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getAliasIdLookupList(message.context, message.alias)
      }
      break

    case 'ajax-getAffectHistory':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = listAffectHistory(userData.id)
      }
      break

    case 'ajax-getUserStatus':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getUserStatus(userData.id)
      }
      break

    case 'ajax-getUserTeams':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getUserTeams()
      }
      break

    case 'ajax-teamInfoAndStatus':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = getTeamInfoAndStatus(message.teamID)
      }
      break

    case 'ajax-checkEmail':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = checkEmail(message.email)
      }
      break

    case 'ajax-setUserBasicInfo':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = setUserBasicInfo(userData.id, message.basicUserInfo)
      }
      break

    case 'ajax-setUserAffect':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = setUserAffect(userData.id, message.context, message.affectID, message.privacy)
      }
      break

    case 'ajax-setCollaboration':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = setCollaboration(userData.id, message.collaboration, message.context)
      }
      break

    case 'ajax-setTimeToRespond':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = setTimeToRespond(userData.id, message.timeToRespond, message.context)
      }
      break

    case 'ajax-setFavoriteAffect':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = setFavoriteAffect(userData.id, message.affectID)
      }
      break

    case 'ajax-removeFavoriteAffect':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = removeFavoriteAffect(userData.id, message.affectID)
      }
      break

    case 'ajax-getFavoriteAffects':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No user id available (not logged in?)'
        })
      } else {
        promise = listFavoriteAffects(userData.id)
      }
      break

    case 'ajax-setTeamDisabledAffect':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No team id available (not logged in?)'
        })
      } else {
        promise = setTeamDisabledAffect(message.teamID, message.affectID)
      }
      break

    case 'ajax-removeTeamDisabledAffect':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No team id available (not logged in?)'
        })
      } else {
        promise = removeTeamDisabledAffect(message.teamID, message.affectID)
      }
      break

    case 'ajax-getTeamDisabledAffects':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No team id available (not logged in?)'
        })
      } else {
        promise = listTeamDisabledAffects(message.teamID)
      }
      break

    case 'ajax-teamAffectTemperature':
      if (!userData.id) {
        promise = Promise.resolve({
          error: 'No team id available (not logged in?)'
        })
      } else {
        promise = getTeamAffectTemperature(message.teamID)
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

// Allow 401 responses to 'resolve' instead of 'reject'
function validateStatus (status) {
  return ((status >= 200 && status < 300) || status === 401)
}

function validateAccount (email, password, expiration, context) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}auth/login`,
      { email, password, expiration, context: (context || 'unknown') }
    )

    // Listen for server response or error
    requestPromise.then((response) => { resolve(response.data) })
    requestPromise.catch((error) => { reject(error) })
  })
}

function getEmojiList () {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/list?fullInfo&perPage=500`, config)

    // Listen for server response or error
    requestPromise.then((response) => {
      const emojiList = response?.data?.data
      resolve(emojiList)
    })
    requestPromise.catch((error) => { reject(error) })
  })
}

function listAffectHistory (userID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/listHistory/userID/${userID}/affectLogID/dateStart/dateEnd`, config)

    // Listen for server response or error
    requestPromise.then((response) => {
      const moodHistoryList = response?.data
      resolve(moodHistoryList)
    })
    requestPromise.catch((error) => { reject(error) })
  })
}

function getUserStatus (userID) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/status/${userID}`, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function getFullUserInfo (userID) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/details/${userID}`, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function getKarunaSettings () {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/settings`, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function setKarunaSettings (settings) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader() }
    const data = { settings }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/settings`, data, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function getAliasIdLookupList (context, alias) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const data = { context, alias }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/alias_lookup`, data, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

// Retrieve list of teams for user
function getUserTeams () {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/teams/`, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function getTeamInfoAndStatus (teamID) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/listInTeam/${teamID}`, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function getTeamAffectTemperature (teamID) {
  return new Promise((resolve, reject) => {
    // Request data from the server
    const config = { headers: authorizationHeader(), validateStatus }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/team/getTeamAffectTemperature/${teamID}`, config)
    requestPromise.then((response) => {
      return resolve(response?.data)
    })

    // Reject on error from the first request (request to get user status)
    requestPromise.catch((error) => { return reject(error) })
  })
}

function checkEmail (email) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}auth/email`,
      { email },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setUserBasicInfo (userID, userBasicInfo) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/update`,
      { id: userID, ...userBasicInfo },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setUserAffect (userID, context, affectID, isPrivate) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/insertHistory`,
      { userID, context: (context || 'unknown'), affectID, isPrivate },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setCollaboration (userID, collaborationStatus, context) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/collaboration`,
      { userID, context: (context || 'unknown'), collaborationStatus },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setTimeToRespond (userID, timeToRespond, context) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/user/timeToRespond`,
      { userID, context: (context || 'unknown'), timeToRespond },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setFavoriteAffect (userID, affectID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/setFavoriteAffect`,
      { userID, affectID },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function removeFavoriteAffect (userID, affectID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/removeFavoriteAffect`,
      { userID, affectID },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function listFavoriteAffects (userID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/listFavoriteAffects/${userID}`, config)
    // Listen for server response or error
    requestPromise.then((response) => {
      const favoriteAffectsList = response?.data
      if (favoriteAffectsList) resolve(favoriteAffectsList)
      else resolve([])
    })
    requestPromise.catch((error) => { reject(error) })
  })
}

function setTeamDisabledAffect (teamID, affectID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/setTeamDisabledAffect`,
      { teamID, affectID },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function removeTeamDisabledAffect (teamID, affectID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.post(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/removeTeamDisabledAffect`,
      { teamID, affectID },
      config
    )

    // Listen for server response or error
    requestPromise.then(() => { resolve() })
    requestPromise.catch((error) => { reject(error) })
  })
}

function listTeamDisabledAffects (teamID) {
  return new Promise((resolve, reject) => {
    // Send request to server via Axios
    const config = { headers: authorizationHeader() }
    const requestPromise = Axios.get(`https://${SERVER_CONFIG.HOST_NAME}/${SERVER_CONFIG.ROOT}data/affect/listTeamDisabledAffects/${teamID}`, config)
    // Listen for server response or error
    requestPromise.then((response) => {
      const disabledAffectsList = response?.data
      if (disabledAffectsList) resolve(disabledAffectsList)
      else resolve([])
    })
    requestPromise.catch((error) => { reject(error) })
  })
}
