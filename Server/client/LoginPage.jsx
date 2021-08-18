import $ from 'jquery'

import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Container, CssBaseline } from '@material-ui/core'

import Copyright from './components/Copyright.jsx'
import SignInForm from './components/SignInForm.jsx'

import { extractDestination, preValidate, validateLogin } from './authHelper.js'

// Pre-validate based on stored token
$(() => {
  // Extract and cache the destination URL
  extractDestination()

  // Check if already logged in then run 'showLogin'
  preValidate(showLogin)
})

// Callback from pre-validate method
function showLogin (result, message) {
  // Show message
  $('#validateMsg').text(message)

  // If token was invalid, show the login form
  if (!result) {
    // Hide the message, Show the form
    $('#preValidate').attr('hidden', true)

    // Render the form
    ReactDOM.render(
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <SignInForm signInUserCallback={validateLogin} />
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>,
      document.getElementById('root')
    )
  }
}
