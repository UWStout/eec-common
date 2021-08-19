import React from 'react'
import ReactDOM from 'react-dom'

import { CssBaseline, Container, Box, Typography } from '@material-ui/core'

import KarunaIcon from './clientComponents/KarunaIcon.jsx'
import Copyright from './clientComponents/Copyright.jsx'

// Static style for the root element
const rootStyle = {
  marginTop: `${8 * 8}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const titleTextStyle = {
  width: '100%',
  textAlign: 'center',
  marginTop: `${1 * 8}px`,
  marginBottom: `${2 * 8}px`,
  paddingBottom: `${5 * 8}px`,
  borderBottom: '1px solid lightgray'
}

const captionTextStyle = {
  paddingBottom: `${2 * 8}px`,
  borderBottom: '1px solid lightgray'
}

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="xs">
    <CssBaseline />
    <div style={rootStyle}>
      <KarunaIcon />
      <div style={titleTextStyle}>
        <Typography component="h1" variant="h5" gutterBottom>
          {'Karuna Account Recovery'}
        </Typography>
      </div>
      <div style={captionTextStyle}>
        <Typography variant="body1" color="textSecondary">
          {'Currently there is no automatic way to reset your password.'}
          <br />
          <br />
          {'Please contact an administrator for help.'}
        </Typography>
      </div>
    </div>
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
