import React from 'react'

import { Grid, Typography } from '@material-ui/core'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

/**
 * Default blank message when there is nothing else to show
 * (always at the bottom of the stack, should never be popped)
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
