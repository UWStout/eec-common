import React from 'react'

import { Typography, Grid } from '@material-ui/core'

export default function BasicUsage () {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h5">
          {'Getting Started with Karuna'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          {'(basic usage instructions coming soon)'}
        </Typography>
      </Grid>
    </Grid>
  )
}
