
import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'

import { Box, Container, CssBaseline } from '@material-ui/core'

import Copyright from './sharedComponents/Copyright.jsx'
import TeamCultureComponent from './adminComponents/TeamCultureComponent.jsx'

// Extract teamID from the URL
const searchParams = new URLSearchParams(window.location.search)
const teamID = searchParams.get('teamID')

// Lookup to the JWT in cookies
const userInfo = decodeJWTPayload(Cookies.get('JWT'))

// Render the form
ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <TeamCultureComponent user={userInfo} teamID={teamID} />
    <Box mt={8} mb={4}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)

function decodeJWTPayload (JWT) {
  try {
    // Base64 decode second field in the token (the payload)
    const jsonStr = atob(JWT.split('.')[1])
    return JSON.parse(jsonStr)
  } catch (err) {
    return undefined
  }
}
