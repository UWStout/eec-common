import React from 'react'
import ReactDOM from 'react-dom'

import { Container, CssBaseline, Box } from '@material-ui/core'

import DataList from './adminComponents/DataList.jsx'
import Copyright from './clientComponents/Copyright.jsx'

ReactDOM.render(
  <Container component="main" maxWidth="md">
    <CssBaseline />
    <DataList dataType={'user'} />
    <Box mt={8}>
      <Copyright />
    </Box>
  </Container>,
  document.getElementById('root')
)
