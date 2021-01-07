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
