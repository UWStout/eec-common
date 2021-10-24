import React from 'react'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { ConnectVisibilityState, DisableInputState } from '../data/globalSate/appState.js'
import { PopConnectActivityState, PushConnectActivityState } from '../data/globalSate/connectActivityState.js'

import { Grid, Typography } from '@material-ui/core'

import CaptionedButton from '../Shared/CaptionedButton.jsx'

import { logout } from '../data/backgroundHelper.js'
import { ACTIVITIES } from '../KarunaConnect/Activities/Activities.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('More User Settings Act', 'orange', 'white')

export default function MoreSettingsComponent (props) {
  // Global state setters
  const setConnectVisibility = useSetRecoilState(ConnectVisibilityState)
  const pushActivity = useSetRecoilState(PushConnectActivityState)
  const popActivity = useSetRecoilState(PopConnectActivityState)
  const disableAllInput = useRecoilValue(DisableInputState)

  // Push account settings activity
  const onAccountSettings = () => {
    pushActivity(ACTIVITIES.ACCOUNT_SETTINGS.key)
  }

  // Push karuna settings activity
  const onCustomizeKaruna = () => {
    pushActivity(ACTIVITIES.KARUNA_SETTINGS.key)
  }

  // On sign out, hide drawer, then remove activity and logout
  const onSignOut = () => {
    setConnectVisibility(false)
    setTimeout(() => {
      popActivity(ACTIVITIES.MORE_SETTINGS.key)
      logout()
    }, 500)
  }

  return (
    <Grid container item spacing={2}>

      <Grid item xs={12}>
        <Typography variant="body1">{'More Settings'}</Typography>
      </Grid>

      <Grid item xs={12}>
        <CaptionedButton onClick={onAccountSettings} buttonText="Account Settings" disabled={disableAllInput}>
          {'Options for changing your name, email, and password.'}
        </CaptionedButton>
      </Grid>

      <Grid item xs={12}>
        <CaptionedButton onClick={onCustomizeKaruna} buttonText="Customize Karuna" disabled={disableAllInput}>
          {'Options for changing how Karuna behaves.'}
        </CaptionedButton>
      </Grid>

      <Grid item xs={12}>
        <CaptionedButton onClick={onSignOut} buttonText="Sign Out" disabled={disableAllInput}>
          {'Sign out of the Karuna Extension and clear all credentials.'}
        </CaptionedButton>
      </Grid>
    </Grid>
  )
}
