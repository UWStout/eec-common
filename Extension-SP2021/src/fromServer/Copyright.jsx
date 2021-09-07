import React from 'react'
import PropTypes from 'prop-types'

import { Link, Typography } from '@material-ui/core'

export default function Copyright (props) {
  const { noLinks } = props
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
      {!noLinks &&
        <React.Fragment>
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
        </React.Fragment>}
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

Copyright.propTypes = {
  noLinks: PropTypes.bool
}

Copyright.defaultProps = {
  noLinks: false
}
