import React from 'react'

import { Link, Typography } from '@material-ui/core'

export default function Copyright () {
  return (
    <React.Fragment>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="/">
          {'The Karuna Research Team'}
        </Link>
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <br />
      <Typography variant="body2" color="textSecondary" align="center">
        {'Server '}
        <Link color="inherit" underline="always" href="/Login.html">
          {'login'}
        </Link>
        {' or '}
        <Link color="inherit" underline="always" href="/Logout.html">
          {'logout'}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Read our current '}
        <Link color="inherit" underline="always" href="/Privacy.html">
          {'privacy policy'}
        </Link>
        {'.'}
      </Typography>
      <br />
      <Typography variant="body2" color="textSecondary" align="center">
        {'This research was funded in part by a '}
        <Link color="inherit" target="_blank" href="https://www.wisys.org/grants/ignitegrantprogram-appliedresearch">
          {'WiSys Ignite Grant'}
        </Link>
        {'.'}
      </Typography>
    </React.Fragment>
  )
}
