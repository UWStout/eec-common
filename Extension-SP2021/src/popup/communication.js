// Retrieve background page and attach to global callback
export function attachBackgroundPage (receiveCallback) {
  initScriptCommunication(receiveCallback).then((newBackground) => {
    window.extBackground = newBackground
  }).catch((error) => {
    window.extBackground = null
    console.error(error)
  })
}

// Listen for messages and retrieve the background page context
export function initScriptCommunication (receiveCallback) {
  // Setup a extension message listener
  chrome.runtime.onMessage.addListener(receiveCallback)

  // Access the background window object
  return new Promise((resolve, reject) => {
    chrome.runtime.getBackgroundPage((background) => {
      // Did the background context arrive
      if (!background) {
        return reject(new Error('Failed to retrieve background context'))
      }

      // Return the background context
      console.log('Background window retrieved')
      return resolve(background)
    })
  })
}
