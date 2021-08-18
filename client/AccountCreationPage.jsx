import React from 'react'
import ReactDOM from 'react-dom'

import { RecoilRoot } from 'recoil'

import { CssBaseline, Box } from '@material-ui/core'

import SignUpForm from './components/SignUpForm.jsx'
import Copyright from './components/Copyright.jsx'

ReactDOM.render(
  <RecoilRoot>
    <CssBaseline />
    <SignUpForm />
    <Box mt={8}>
      <Copyright />
    </Box>
  </RecoilRoot>,
  document.getElementById('root')
)
