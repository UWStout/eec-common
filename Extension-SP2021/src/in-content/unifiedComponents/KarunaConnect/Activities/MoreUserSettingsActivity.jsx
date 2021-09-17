import React from 'react'

import { ConnectVisibilityState, PopActivityState } from '../../data/globalSate/appState.js'
import { useSetRecoilState } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'

import { ACTIVITIES } from './Activities.js'
import { logout } from '../../data/backgroundHelper.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('More User Settings Act', 'orange', 'white')

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    padding: theme.spacing(1)
  }
}))

export default function MoreUserSettingsActivity (props) {
  const classes = useStyles()

  // Global state setters
  const setConnectVisibility = useSetRecoilState(ConnectVisibilityState)
  const popActivity = useSetRecoilState(PopActivityState)

  // On sign out, hide drawer, then remove activity and logout
  const onSignOut = () => {
    setConnectVisibility(false)
    setTimeout(() => {
      popActivity(ACTIVITIES.MORE_USER_SETTINGS.key)
      logout()
    }, 500)
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Button color="primary" onClick={onSignOut} className={classes.buttonStyle}>
          {'Sign out'}
        </Button>
      </Grid>
    </Grid>
  )
}
