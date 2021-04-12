/**
 * Generic chrome.runtime.sendMessage function to simplify AJAX calls to the background.
 * Background messages are processed in ServerAJAXComms.js which returns a promise.
 * @param {object} messageObject a message object which must at minimum include a type: string
 * @param {string} errorMessage message to return as an alert
 * @param {function} doWork parameter(data), function defined within context to perform a basic message task
 */
export function backgroundMessage (messageObject, errorMessage, errorWork = null, doWork) {
  chrome.runtime.sendMessage(messageObject, (data) => {
    if (data && data.error) {
      console.log(errorMessage + '\n' + data.error.message + '\n' + data.error)
      if (errorWork) {
        errorWork()
      }
    } else if (doWork) {
      doWork(data)
    }
  })
}
