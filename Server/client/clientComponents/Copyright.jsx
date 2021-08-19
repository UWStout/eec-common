import React from 'react'

import { Link, Typography } from '@material-ui/core'

export default function Copyright () {
  return (
    <React.Fragment>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://karuna.net/">
          {'The Karuna Research Team'}
        </Link>
        {' '}
        {new Date().getFullYear()}
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
