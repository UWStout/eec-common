import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Box, Link, Grid } from '@material-ui/core'

// Borrow the karuna icon from server
import KarunaIcon from '../../fromServer/KarunaIcon.jsx'

// Borrow the copyright from server
import Copyright from '../../fromServer/Copyright.jsx'

export default function PopupWidget (props) {
  // Destructure the props
  const { version, mode, serverHost } = props

  // Sign-out button callback
  const onSignOut = () => {
    console.log('Attempting to log out')
    chrome.runtime.sendMessage({ type: 'logout' })
  }

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={3}>
        <KarunaIcon />
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h5" component="h1">{'Karuna Communication Extension'}</Typography>
        <Typography variant="body1">{`v ${version}, ${mode} mode`}</Typography>
        <Link href={serverHost} target="_blank" underline="always" color="textSecondary">
          {serverHost}
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Box mt={2}>
          <Typography variant="body1">
            {'Quick Links: '}
            <Link href='#' underline="always" onClick={onSignOut}>
              {'Sign out'}
            </Link>
            {', '}
            <Link href='https://karuna.run/Register.html' underline="always" target="_blank">
              {'Create account'}
            </Link>
            {', '}
            <Link href='mailto:karunaeec@gmail.com' underline="always" target="_blank">
              {'Submit feedback'}
            </Link>
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box borderColor="grey.500" border={1} borderRight={0} borderLeft={0} py={1} my={2}>
          <Typography variant="body1">
            {'The Karuna extension is installed and working.'}
            <br />
            <br />
            {'To get started using Karuna, visit '}
            <Link href="https://teams.microsoft.com" target="_blank">
              {'teams.microsoft.com'}
            </Link>
            {' or '}
            <Link href="https://discord.com" target="_blank">
              {'discord.com'}
            </Link>
            {' and click on the Karuna bubble in the bottom right.'}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Copyright noLinks />
      </Grid>
    </Grid>
  )
}

PopupWidget.propTypes = {
  version: PropTypes.string,
  mode: PropTypes.string,
  serverHost: PropTypes.string
}

PopupWidget.defaultProps = {
  version: '0.0.0 ?',
  mode: 'unknown',
  serverHost: 'https://localhost:3000#undefined'
}
