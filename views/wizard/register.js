/* global $, axios */

// Global element references
let accountForm
let originalPW
let confirmPW

// Code to run with page finishes loading
document.body.onload = () => {
  // Lookup the password fields and store for later use
  originalPW = $('#inputPassword')
  confirmPW = $('#confirmPassword')

  // Changes to both fields should validate the confirmation PW
  originalPW.on('input', checkPasswords)
  confirmPW.on('input', checkPasswords)

  // Setup our form submit action
  accountForm = $('.form-signin')
  accountForm.on('submit', (event) => {
    // Prevent the normal event actions
    event.preventDefault()
    event.stopPropagation()

    // Validate
    validateForm()
  })
}

// Custom validation for the password fields
function checkPasswords () {
  if (confirmPW.val() !== originalPW.val()) {
    confirmPW[0].setCustomValidity('Passwords Must Match.')
  } else {
    confirmPW[0].setCustomValidity('')
  }
}

function validateForm () {
  // Remove old alerts
  $('.alert').alert('close')

  // check form validity
  const isValid = accountForm[0].checkValidity()
  if (isValid) {
    // If there were no errors, show success
    accountForm.removeClass('was-validated')
    createAccount()
  } else {
    // Add alerts for any errors
    accountForm.addClass('was-validated')
    $('.form-control').each((i, elem) => {
      const text = elem.validationMessage
      if (text) {
        addAlert(`${elem.name}: ${text}`, 'alert-danger')
      }
    })
  }
}

// Add a new alert to the end of the form
function addAlert (text, style) {
  const alertDiv = $('<div>').addClass('alert alert-dismissible feedback-info ' + style)
  alertDiv.html(`<button type="button" class="close" data-dismiss="alert">&times;</button>${text}`)
  accountForm.append(alertDiv)
}

// Create the account using the back-end RESTful api
async function createAccount () {
  // Get info for new user
  const newUser = {
    firstName: $('#firstName').val(),
    lastName: $('#lastName').val(),
    email: $('#inputEmail').val(),
    password: $('#inputPassword').val()
  }

  try {
    // Try to send the register request
    const response = await axios.post('/auth/register', newUser)

    // Show a success alert message
    addAlert('Register Succeeded', 'alert-success')
    accountForm[0].reset()
    console.log(response.data)
  } catch (err) {
    // Show a failed alert message
    addAlert('Register Failed', 'alert-danger')
    console.log(err)
  }
}
