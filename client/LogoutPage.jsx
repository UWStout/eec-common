import $ from 'jquery'
import store from 'store2'
import Cookies from 'js-cookie'

import React from 'react'
import ReactDOM from 'react-dom'

import { CssBaseline, Container, Box, Typography } from '@material-ui/core'

import KarunaIcon from './clientComponents/KarunaIcon.jsx'
import Copyright from './clientComponents/Copyright.jsx'

// Pre-validate based on stored token
$(() => {
  // Remove existing tokens
  store.local.remove('JWT')
  Cookies.remove('JWT')

  // Redirect to login
  setTimeout(() => { window.location.href = './Login.html' }, 1500)
})

// Static style for the root element
const rootStyle = {
  marginTop: `${8 * 8}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="xs">
    <CssBaseline />
    <div style={rootStyle}>
      <KarunaIcon />
      <Typography component="h1" variant="h5">
        {'Clearing credentials ...'}
      </Typography>
    </div>
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
