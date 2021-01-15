/* globals axios, store, Cookies */
/* extern preValidate */
let token = ''

/**
 * A function to quickly check the validity of the stored JWT and bypass
 * login if it is still valid. Runs asynchronously and requires callback.
 * @param {string} destURL Destination for redirection if login is valid
 * @param {function} result Callback, receives bool for if login is 'valid' and message as string
 */
function preValidate (destURL, result) {
  if (checkForToken()) {
    // Validate and redirect
    axios.get('/auth/validate', {
      headers: {
        Authorization: `digest ${token}`
      }
    }).then((response) => {
      result(true, 'Login valid. Redirecting ...')
      setTimeout(() => { window.location.href = destURL }, 1500)
    }).catch(() => {
      // Token did not validate
      store.local.remove('JWT')
      Cookies.remove('JWT')
      result(false, 'Invalid, please login')
    })
  } else {
    // No token found
    result(false, 'Please login')
  }
}

// Check the token and refresh the cookie
function checkForToken () {
  token = store.local.get('JWT')
  if (!token || token === '') { return false }
  Cookies.set('JWT', token)
  return true
}
