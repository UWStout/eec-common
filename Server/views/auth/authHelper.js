/* globals axios, store, Cookies */
/* extern preValidate */
let token = ''

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

// Check the token
function checkForToken () {
  token = store.local.get('JWT')
  if (!token || token === '') { return false }
  return true
}
