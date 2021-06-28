/**
 * Generic chrome.runtime.sendMessage function to simplify interacting with the background part of the
 * extension.  Background messages are processed as follows:
 * - If 'type' is 'read' or 'write', it is processed near line 82 in ExtensionComms.js
 * - If 'type' is 'getUser', 'login', or 'logout', is is also in ExtensionComms.js near line 82
 * - If 'type' starts with 'ajax-' it will be processed in ServerAJAXComms.js
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
      console.error(errorMessage + '\n' + data.error.message + '\n' + data.error)
      if (errorCB) {
        return errorCB()
      }
    }

    if (successCB) {
      return successCB(data)
    }
  })
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
      () => { return reject(new Error('Failed to retrieve emoji list')) }
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
      (newPrivacy) => { return resolve(newPrivacy.value) },
      () => { return reject(new Error('Failed to read privacy settings')) }
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
      () => { return reject(new Error('Failed to retrieve user status')) }
    )
  })
}
