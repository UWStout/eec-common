import React from 'react'
import ReactDOM from 'react-dom'

import { CssBaseline, Container, Box } from '@material-ui/core'

import Copyright from './sharedComponents/Copyright.jsx'
import RecoveryRequest from './clientComponents/RecoveryRequest.jsx'

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <RecoveryRequest />
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
