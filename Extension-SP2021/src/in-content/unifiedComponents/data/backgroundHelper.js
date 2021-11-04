// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('BACKGROUND Helper', '#27213C', '#EEF4ED')

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
      LOG(errorMessage, data)
      if (errorCB) {
        return errorCB(data.message, data.error)
      }
    }

    if (successCB) {
      return successCB(data)
    }
  })
}

export function login (email, password, expiration, onFailed, context) {
  sendMessageToBackground(
    { type: 'ajax-validateAccount', email, password, expiration },
    context,
    'Invalid username or password',
    (data) => {
      LOG('Login succeeded')
      chrome.runtime.sendMessage({ type: 'login', data })
    },
    onFailed
  )
}

export function rolloverToken () {
  LOG('Attempting to rollover token')
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-rolloverToken' },
      '*',
      'token rollover failed',
      (data) => {
        LOG('Rollover succeeded')
        chrome.runtime.sendMessage({ type: 'refresh', data })
        return resolve(data)
      },
      (message, err) => {
        LOG('Rollover failed', err)
        return reject(err)
      }
    )
  })
}

export function logout () {
  LOG('Logging out and clearing credentials')
  sendMessageToBackground({ type: 'logout' }, 'unknown', 'Failed to logout')
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
      (message) => {
        LOG.error('Error retrieving affect list')
        LOG.error(message)
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error retrieving affect history list')
        LOG.error(message)
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error retrieving favorite affect list')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function setFavoriteAffect (affectID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-setFavoriteAffect', affectID }, // <- only the message type is needed
      context,
      'updating Favorite affects failed: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => {
        LOG.error('Error setting favorite affect')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function removeFavoriteAffect (affectID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-removeFavoriteAffect', affectID }, // <- only the message type is needed
      context,
      'updating Favorite affects failed: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => {
        LOG.error('Error removing favorite affect')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveTeamDisabledAffectsList (teamID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-getTeamDisabledAffects', teamID }, // <- only the message type is needed
      context,
      'Disabled affects retrieval failed: ',

      // Success and failure callbacks
      (data) => { return resolve(data) },
      (message) => {
        LOG.error('Error retrieving team disabled affects')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function setTeamDisabledAffect (teamID, affectID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-setTeamDisabledAffect', teamID, affectID }, // <- only the message type is needed
      context,
      'updating Disabled affects failed: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => {
        LOG.error('Error setting team disabled affect')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function removeTeamDisabledAffect (teamID, affectID, context = 'none') {
  return new Promise((resolve, reject) => {
    // Retrieve the full affect History list
    sendMessageToBackground(
      // Read from the back-end server using AJAX
      { type: 'ajax-removeTeamDisabledAffect', teamID, affectID }, // <- only the message type is needed
      context,
      'updating Disabled affects failed: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => {
        LOG.error('Error removing team disabled affect')
        LOG.error(message)
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error setting current affect')
        LOG.error(message)
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error setting current collaboration status')
        LOG.error(message)
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error setting time to respond')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveUserStatus (context = 'none') {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-getUserStatus' },
      context,
      'Retrieving current user status failed: ',
      (currentUserStatus) => { return resolve(currentUserStatus) },
      (message) => {
        LOG.error('Error retrieving current user status')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveUserTeams (context = 'none') {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-getUserTeams' },
      context,
      'Retrieving current user teams failed: ',
      (userTeams) => { return resolve(userTeams) },
      (message) => {
        LOG.error('Error retrieving current user teams')
        LOG.error(message)
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error retrieving team user info/status')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveTeamAffectTemperature (teamID) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-teamAffectTemperature', teamID },
      'N/A', // Context does not matter
      'Retrieving team temperature failed: ',
      (temperature) => { return resolve(temperature) },
      (message) => {
        LOG('Error retrieving team temperature')
        return reject(new Error(message))
      }
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
      (message) => {
        LOG.error('Error retrieving basic user info')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function checkUserEmail (email) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-checkEmail', email },
      'N/A', // Context doesn't matter
      'Checking if email is in use failed: ',
      () => { return resolve() },
      (message) => {
        LOG.error('Error checking if email is in use')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function updateBasicUserInfo (userBasicInfo) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-setUserBasicInfo', userBasicInfo },
      'N/A', // Context doesn't matter
      'Updating basic user info failed: ',
      (newToken) => {
        LOG('Received new token:', newToken)
        return resolve(newToken)
      },
      (message) => {
        LOG.error('Error updating basic user info')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveKarunaSettings () {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-karunaSettings' },
      'N/A', // Context doesn't matter
      'Retrieving karuna settings: ',
      (karunaSettings) => { return resolve(karunaSettings) },
      (message) => {
        LOG('Failed to retrieve karuna settings')
        return resolve({})
      }
    )
  })
}

export function updateKarunaSettings (karunaSettings) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-setKarunaSettings', karunaSettings },
      'N/A', // Context doesn't matter
      'Updating karuna settings failed: ',
      () => { return resolve() },
      (message) => {
        LOG.error('Error updating karuna settings')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveExtendedUserInfo (userId) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-fullUserInfo', userId },
      'N/A', // Context doesn't matter
      'Retrieving extended user info failed: ',
      (userInfo) => { return resolve(userInfo) },
      (message) => {
        LOG.error('Error retrieving extended user info')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveAliasLookupInfo (context, alias) {
  return new Promise((resolve, reject) => {
    sendMessageToBackground(
      { type: 'ajax-lookupAliasIds', alias },
      context,
      'Retrieving alias lookup info failed: ',
      (userInfo) => { return resolve(userInfo) },
      (message) => {
        LOG.error('Error retrieving alias lookup info')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function retrieveCachedAliasInfo (context) {
  return new Promise((resolve, reject) => {
    // Read the alias list from the background context
    sendMessageToBackground(
      // Read from browser local storage
      { type: 'read', key: 'aliasList' },
      context,
      'Failed to READ alias list: ',

      // Success and failure callbacks
      (aliasList) => { return resolve(aliasList) },
      (message) => {
        LOG.error('Error reading cached alias list')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function updateToken (token) {
  return new Promise((resolve, reject) => {
    // Send new token to background
    sendMessageToBackground(
      // Write to browser local storage
      { type: 'refresh', data: token },
      null,
      'Failed to WRITE new token: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => {
        LOG.error('Error writing new token')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}

export function updateCachedAliasInfo (context, aliasList) {
  return new Promise((resolve, reject) => {
    // Write the alias list to the background context
    sendMessageToBackground(
      // Write to browser local storage
      { type: 'write', key: 'aliasList', data: aliasList },
      context,
      'Failed to WRITE alias list: ',

      // Success and failure callbacks
      () => { return resolve() },
      (message) => {
        LOG.error('Error writing cached alias list')
        LOG.error(message)
        return reject(new Error(message))
      }
    )
  })
}
