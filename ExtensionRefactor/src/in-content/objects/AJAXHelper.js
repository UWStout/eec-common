// Executes a generic background message
// Can and will be overloaded and extendable
export function defaultMessage (callType, errorMessage, doWork) {
  chrome.runtime.sendMessage({ type: callType }, (data) => {
    if (data.error) {
      window.alert(errorMessage + data.error.message)
      console.log(data.error)
    } else {
      doWork(data)
    }
  })
}
