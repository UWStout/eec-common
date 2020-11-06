// Store2 stor
import store from 'store2'

// Listen to short lived messages from in-content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Parse out the message structure
  if (!message.type && typeof message === 'string') {
    try {
      message = JSON.parse(message)
    } catch (error) {
      console.log('BACKGROUND: Failed to parse message')
      console.log(message)
      return
    }
  }

  // check message structure
  if (!message.type || !message.key) {
    console.log('BACKGROUND: message missing type or key')
    console.log(message)
    return
  }

  // Execute message
  switch (message.type.toLowerCase()) {
    // Read a value from storage
    case 'read':
      sendResponse(store.local.get(message.key))
      break

    // Write a value to storage
    case 'write':
      store.local.set(message.key, message.data, true)
      break
  }
})
