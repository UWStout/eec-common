import React from 'react'

import { Grid, Typography } from '@material-ui/core'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

/**
 * Manage the affect survey when shown in the connect panel
 **/
export default function BlankActivity (props) {
  // Show affect survey
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'All is Well!'}
        </Typography>
        <Typography variant="body1">
          {'Start typing a message to receive feedback from Karuna here.'}
        </Typography>
      </Grid>
    </Grid>
  )
}
