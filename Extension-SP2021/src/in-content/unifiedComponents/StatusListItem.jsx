import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Grid, Avatar}  from '@material-ui/core'

export default function StatusListItem (props) {
  const { userEmail } = props

  return (
    <Grid container>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Avatar>U</Avatar>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography noWrap variant='body1'>My Statuses</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item>
                    <Typography variant='body1'>😁</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body1'>👫</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body1'>🕐</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

StatusListItem.propTypes = {
  userEmail: PropTypes.string.isRequired
}
