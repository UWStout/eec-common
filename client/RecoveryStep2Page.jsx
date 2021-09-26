import React from 'react'
import ReactDOM from 'react-dom'

import { CssBaseline, Container, Box } from '@material-ui/core'

import Copyright from './sharedComponents/Copyright.jsx'
import PasswordReset from './clientComponents/PasswordReset.jsx'

// Look for Token in URI
const token = (new URLSearchParams(window.location.search)).get('token')

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <PasswordReset token={token} />
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
