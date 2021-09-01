import React from 'react'
import ReactDOM from 'react-dom'

import { CssBaseline, Box } from '@material-ui/core'

import Register from './clientComponents/Register.jsx'
import Copyright from './sharedComponents/Copyright.jsx'

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Register />
    <Box mt={8}>
      <Copyright />
    </Box>
  </React.Fragment>,
  document.getElementById('root')
)
