/**
 * Generic chrome.runtime.sendMessage function to simplify AJAX calls to the background.
 * Background messages are processed in ServerAJAXComms.js which returns a promise.
 * @param {object} messageObject a message object which must at minimum include a type: string
 * @param {string} errorMessage message to return as an alert
 * @param {function} doWork parameter(data), function defined within context to perform a basic message task
 */
export function backgroundMessage (messageObject, errorMessage, doWork) {
  chrome.runtime.sendMessage(messageObject, (data) => {
    if (data.error) {
      window.alert(errorMessage + data.error.message)
      console.log(data.error)
    } else {
      doWork(data)
    }
  })
}