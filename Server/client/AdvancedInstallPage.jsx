
import React from 'react'
import ReactDOM from 'react-dom'

import { Box, Container, CssBaseline } from '@material-ui/core'

import Copyright from './sharedComponents/Copyright.jsx'
import AdvInstallContainer from './clientComponents/AdvInstallContainer.jsx'

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <AdvInstallContainer />
    <Box mt={8} mb={4}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
