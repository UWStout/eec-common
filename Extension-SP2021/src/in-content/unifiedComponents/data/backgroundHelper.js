// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('BACKGROUND Helper', '#27213C', '#EEF4ED')

// A delay to test lazy loading
const FAKE_DELAY = 0

/**
 * Generic chrome.runtime.sendMessage function to simplify interacting with the background part of the
 * extension.  Background messages are processed as follows:
 * - If type is 'read' or 'write', it is processed near line 82 in ExtensionComms.js
 * - If type is 'getUser', 'login', or 'logout', is is also in ExtensionComms.js near line 82
 * - If type starts with 'ajax-' it will be processed in ServerAJAXComms.js
 *
 * @param {object} messageObject a message object which must at include a `type` string
 * @param {string} context Identifies the messaging tool in use (teams vs slack vs discord)
 * @param {string} errorMessage message to return as an alert
 * @param {function} errorCB Callback to run when an error occurs (takes no parameters)
 * @param {function} successCB Callback that runs on success and receives any data returned by the response
 */
export function sendMessageToBackground (messageObject, context = 'none',
  errorMessage = 'Unknown error', successCB = null, errorCB = null) {
  chrome.runtime.sendMessage({ ...messageObject, context }, (data) => {
    if (data && data.error) {
      LOG(errorMessage, data.error)
      if (errorCB) {
        return errorCB(data.error)
      }
    }

    if (successCB) {
      return successCB(data)
    }
  })
}

export function login (email, password, onFailed, context) {
  LOG(`Attempting to login with "${email}" and "${password}"`)
  sendMessageToBackground(
    { type: 'ajax-validateAccount', email, password },
    context,
    'Invalid username or password',
    (data) => {
      LOG('Login succeeded')
      chrome.runtime.sendMessage({ type: 'write', key: 'JWT', data })
      chrome.runtime.sendMessage({ type: 'login', key: 'JWT', data })
    },
    onFailed
  )
}

export function retrieveAffectList (context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the current list of emojis
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-getEmojiList' }, // <- only the message type is needed
      context,
      'Emoji Retrieval failed: ',

      // Success and failure callbacks
      (data) => { return resolve(data) },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveAffectHistoryList (context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-getAffectHistory' }, // <- only the message type is needed
      context,
      'Mood history retrieval failed: ',

      // Success and failure callbacks
      (data) => { return resolve(data) },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveFavoriteAffectsList (context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-getFavoriteAffects' }, // <- only the message type is needed
      context,
      'Favorite affects retrieval failed: ',

      // Success and failure callbacks
      (data) => { return resolve(data) },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function setFavoriteAffect (favoriteAffectID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-setFavoriteAffect', favoriteAffectID }, // <- only the message type is needed
      context,
      'updating Favorite affects failed: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveDisabledAffectsList (teamID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-getTeamDisabledAffects', teamID }, // <- only the message type is needed
      context,
      'Disabled affects retrieval failed: ',

      // Success and failure callbacks
      (data) => { return resolve(data) },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function setDisabledAffect (teamID, affectID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-setTeamDisabledAffect', teamID, affectID }, // <- only the message type is needed
      context,
      'updating Disabled affects failed: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveMoodPrivacy (context = 'none') {
  return new Promise((resolve, reject) => {
    // Read the privacy settings from the background context
    sendMessageToBackground(
      // Read from browser local storage
      { type: 'read', key: 'privacy' }, // <- Message object (read/write) (key) [if writing] (value)
      context,
      'Failed to read privacy preferences: ', // <- Message logged to console on error

      // Success and failure callbacks
      (newPrivacy) => {
        if (!newPrivacy.value || newPrivacy.value === 'undefined') {
          return resolve({ private: false, prompt: true })
        }
        return resolve(newPrivacy.value)
      },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function setCurrentAffect (affectID, privacy, context = 'none') {
  return new Promise((resolve, reject) => {
    // Send updated affect/mood status to the background process
    sendMessageToBackground(
      // Send to the back-end server using AJAX
      { type: 'ajax-setUserAffect', affectID, privacy },
      context,
      'Failed to set new mood ID: ', // <- Message logged to console on error

      // Success and failure callbacks
      () => { return resolve() },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function setCurrentCollaboration (collaboration, context = 'none') {
  return new Promise((resolve, reject) => {
    // Send updated collaboration status to the background process
    sendMessageToBackground(
      { type: 'ajax-setCollaboration', collaboration },
      context,
      'Failed to set new collaboration status: ', // <- Message logged to console on error

      // Success and failure callbacks
      () => { return resolve() },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function setTimeToRespond (timeToRespond, context = 'none') {
  return new Promise((resolve, reject) => {
    // Send updated "time to respond" to the background process
    sendMessageToBackground(
      { type: 'ajax-setTimeToRespond', timeToRespond },
      context,
      'Failed to set new time to respond: ', // <- Message logged to console on error

      // Success and failure callbacks
      () => { return resolve() },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function setMoodPrivacy (newPrivacy, context = 'none') {
  return new Promise((resolve, reject) => {
    // Read the privacy settings from the background context
    sendMessageToBackground(
      // Read from browser local storage
      { type: 'write', key: 'privacy', value: newPrivacy }, // <- Message object (read/write) (key) [if writing] (value)
      context,
      'Failed to WRITE privacy preferences: ', // <- Message logged to console on error

      // Success and failure callbacks
      () => { return resolve() },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveUserStatus (context = 'none') {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-getUserStatus' },
      context,
      'Retrieving current user status failed: ',
      (currentUserStatus) => {
        setTimeout(() => { return resolve(currentUserStatus) }, FAKE_DELAY)
      },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveTeamUserInfoAndStatus (teamID) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-teamInfoAndStatus', teamID },
      'N/A', // Context does not matter
      'Retrieving teammates info and status failed: ',
      (userInfo) => { return resolve(userInfo) },
      (message) => { return reject(new Error(message)) }
    )
  })
}

export function retrieveBasicUserInfo () {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'getuser' },
      'N/A', // Context doesn't matter
      'Retrieving basic user info failed: ',
      (userInfo) => { return resolve(userInfo) },
      (message) => { return reject(new Error(message)) }
    )
  })
}
