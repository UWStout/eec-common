import React from 'react'

import { RecoilRoot } from 'recoil'

import { Typography, Grid } from '@material-ui/core'

import SignUpForm from '../../clientComponents/SignUpForm.jsx'

export default function AccountCreation () {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Karuna Account Creation'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          {'Use the form below to create a new account.'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <RecoilRoot>
          <SignUpForm />
        </RecoilRoot>
      </Grid>
    </Grid>
  )
}
