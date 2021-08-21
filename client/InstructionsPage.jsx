
import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Container, CssBaseline } from '@material-ui/core'

import Copyright from './clientComponents/Copyright.jsx'
import Instructions from './clientComponents/Instructions.jsx'

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <Instructions />
    <Box mt={8} mb={4}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
