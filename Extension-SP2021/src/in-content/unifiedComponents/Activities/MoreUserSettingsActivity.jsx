import React from 'react'

import { Grid, Typography } from '@material-ui/core'

import { useSetRecoilState } from 'recoil'
import { PopActivityState } from '../data/globalState.js'

import { ACTIVITIES } from './Activities.js'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('More User Settings Act', 'orange', 'white')

export default function MoreUserSettingsActivity (props) {
  // Global activity states
  const popActivity = useSetRecoilState(PopActivityState)

  // Respond to the dialog closing
  const onDialogClose = () => {
    // Dismiss the activity
    popActivity(ACTIVITIES.MORE_USER_SETTINGS.key)
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography>
          {'More user settings coming soon'}
        </Typography>
      </Grid>
    </Grid>
  )
}
