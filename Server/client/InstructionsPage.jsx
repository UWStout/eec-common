
import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Container, CssBaseline } from '@material-ui/core'

import Copyright from './sharedComponents/Copyright.jsx'
import InstructionsTabbed from './instructionComponents/InstructionsTabbed.jsx'

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <InstructionsTabbed />
    <Box mt={8} mb={4}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
