/* globals $, store, Cookies */

// Clear stored data and redirect
$(document).ready(() => {
  // Remove existing tokens
  store.local.remove('JWT')
  Cookies.remove('JWT')

  // Redirect to login
  setTimeout(() => { window.location.href = './login.html' }, 1500)
})
