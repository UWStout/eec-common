/* globals $, axios, store, Cookies, preValidate */
let accountForm

// Pre-validate based on stored token
$(document).ready(() => { preValidate(showLogin) })

// Callback from pre-validate method
function showLogin (result, message) {
  // Show message
  $('#validateMsg').text(message)

  // If token was invalid, show the login form
  if (!result) {
    // Initialize and show the login form
    accountForm = $('.form-signin')
    accountForm.on('submit', formSubmit)

    // Show the form
    $('#preValidate').prop('hidden', true)
    $('.form-signin').prop('hidden', false)
  }
}

// Runs when form is submitted
function formSubmit (event) {
  // Prevent default reloading of page
  event.preventDefault()
  event.stopPropagation()

  // Dismiss any existing Bootstrap alerts
  $('.alert').alert('close')

  // Check the validity of the form
  if (accountForm[0].checkValidity()) {
    // Form is valid so reset style and content
    accountForm.removeClass('was-validated')
    validateLogin()
  } else {
    // Form is invalid so turn on validation styling
    accountForm.addClass('was-validated')

    // Loop through the form controls
    const inputs = $('#form-signin .form-control')
    for (let i = 0; i < inputs.length; i++) {
      // Check if they have a validation message
      const elem = inputs[i]
      if (elem.validationMessage !== '') {
        // Show validation message in the alert area
        addAlert(`<strong>${elem.name}:</strong> ${elem.validationMessage}`, 'alert-danger')
      }
    }
  }
}

// Add a new alert to the end of the form
function addAlert (text, style) {
  const alertDiv = $('<div>').addClass('alert alert-dismissible feedback-info ' + style)
  alertDiv.html(`<button type="button" class="close" data-dismiss="alert">&times;</button>${text}`)
  accountForm.append(alertDiv)
}

// Create the account using the back-end RESTful api
async function validateLogin () {
  // Get info user
  const userInfo = {
    email: $('#inputEmail').val(),
    password: $('#inputPassword').val()
  }

  try {
    // Try to send the login request
    const response = await axios.post('/auth/login', userInfo)

    // Show a successful alert message
    addAlert('Login Success, redirecting ...', 'alert-success')
    $('.form-signin :input').prop('disabled', true)
    $('.form-signin :button').prop('disabled', true)

    // Set the token and redirect
    store.local.set('JWT', response.data.token)
    Cookies.set('JWT', response.data.token)
    setTimeout(() => { window.location.href = '/oz/' }, 1500)
  } catch (err) {
    // Show a failed alert message
    addAlert('Login Failed', 'alert-danger')
    console.log(err)
  }
}
