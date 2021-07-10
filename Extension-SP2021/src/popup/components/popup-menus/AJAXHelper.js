/**
 * Generic chrome.runtime.sendMessage function to simplify AJAX calls to the background.
 * Background messages are processed in ServerAJAXComms.js which returns a promise.
 * @param {object} messageObject a message object which must at minimum include a type: string
 * @param {string} context A context identifier for which messaging tool is sending this request
 * @param {string} errorMessage message to return as an alert
 * @param {function} errorCB Callback to run when an error occurs (takes no parameters)
 * @param {function} successCB Callback that runs on success and receives any data returned by the response
 */
export function backgroundMessage (messageObject, context = 'none',
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
