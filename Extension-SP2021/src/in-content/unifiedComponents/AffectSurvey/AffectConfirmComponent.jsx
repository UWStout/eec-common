/* eslint-disable react/jsx-indent */
import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { UserTeamsState } from '../data/globalSate/userState.js'
import { ActiveTeamIndexState } from '../data/globalSate/teamState.js'
import { KarunaSettingsState } from '../data/globalSate/settingsState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button } from '@material-ui/core'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Affect Confirm Component', 'yellow', 'black')

const useStyles = makeStyles((theme) => ({
  gridBoxStyle: {
    paddingLeft: `${theme.spacing(2)}px !important`
  },
  captionStyle: {
    color: theme.palette.grey[500]
  }
}))

export default function AffectConfirmComponent (props) {
  const { closeCallback } = props
  const { gridBoxStyle, captionStyle } = useStyles()

  // Global data states
  const karunaSettings = useRecoilValue(KarunaSettingsState)
  const activeTeam = useRecoilValue(ActiveTeamIndexState)
  const teams = useRecoilValue(UserTeamsState)

  // Get ref to current team
  let currentTeam = null
  if (Array.isArray(teams) && activeTeam >= 0 && activeTeam < teams.length) {
    currentTeam = teams[activeTeam]
  }

  // Respond to the dialog closing
  const onDialogClose = () => {
    if (closeCallback) { closeCallback() }
  }

  return (
    <Grid container item spacing={3}>
      <Grid item xs={12}>
        {karunaSettings.alwaysShare
          ? <Typography variant="body1">
              {'Your status was updated and shared. '}
              {'Thank you for sharing your mood with '}
              {currentTeam ? currentTeam.name : 'your team'}
              {'!'}
            </Typography>
          : <Typography variant="body1">
              {'Your status is updated and will be kept private.'}
            </Typography>}
      </Grid>

      <Grid container item xs={12} spacing={1}>
        <Grid item className={gridBoxStyle} xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={onDialogClose}
          >
            {'Ok'}
          </Button>
        </Grid>
      </Grid>

      {!karunaSettings.enablePrivacyPrompt &&
        <Grid item xs={12}>
          <Typography variant="caption" className={captionStyle}>
            {`Your mood status is set to ${karunaSettings.alwaysShare ? '' : 'NOT'} be shared with `}
            {'your team and you will not be prompted.'}
          </Typography>
          <br />
          <br />
          <Typography variant="caption" className={captionStyle}>
            {'To update these choices, click "more settings" then "Customize Karuna" under your status in the Karuna Connect panel.'}
          </Typography>
        </Grid>}
    </Grid>
  )
}

AffectConfirmComponent.propTypes = {
  closeCallback: PropTypes.func
}

AffectConfirmComponent.defaultProps = {
  closeCallback: null
}
