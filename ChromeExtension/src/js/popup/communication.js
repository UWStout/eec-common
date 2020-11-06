// Start the popup script, this could be anything from a simple script to a webapp
export function initPopupScript () {
  // Setup a extension message listener
  chrome.runtime.onMessage.addListener(messageReceived)

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

// callback for messages received from other parts of the extension
function messageReceived (message, sender, sendResponse) {
  console.log(`POPUP: Message from ${sender.url} => ${sender.id}`)
  console.log(message)
}

// callback for messages received from other parts of the extension
function responseReceived (message) {
  console.log('POPUP: Response from background')
  console.log(message)
}
