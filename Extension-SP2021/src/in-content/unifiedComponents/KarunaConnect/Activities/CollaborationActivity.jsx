import React from 'react'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button } from '@material-ui/core'

import { useSetRecoilState } from 'recoil'
import { UserCollaborationState } from '../../data/globalSate/userState.js'
import { PopActivityState } from '../../data/globalSate/appState.js'

import { ACTIVITIES } from './Activities.js'
import { rawCollaborationIcon } from '../../Shared/CollaborationIcon.jsx'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Collaboration Activity', 'blue', 'black')

const IndentedButton = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    marginLeft: theme.spacing(2)
  }
}))(Button)

const useStyles = makeStyles((theme) => ({
  iconTweakStyle: {
    position: 'relative',
    top: '0.125em',
    paddingRight: theme.spacing(1)
  }
}))

export default function CollaborationActivity (props) {
  const { iconTweakStyle } = useStyles()

  // Global data states
  const setCollaboration = useSetRecoilState(UserCollaborationState)

  // Global activity states
  const popActivity = useSetRecoilState(PopActivityState)

  // Respond to the dialog closing
  const onDialogClose = (newCollaborationState) => {
    // Set new collaboration value
    setCollaboration(newCollaborationState)

    // Dismiss the collaboration activity
    popActivity(ACTIVITIES.COLLABORATION_SURVEY.key)
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography>
          {'Currently I am:'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <IndentedButton
          aria-label="Set Collaboration to Focused"
          onClick={() => { onDialogClose('Focused') }}
          color="primary"
        >
          <span className={iconTweakStyle}>
            {rawCollaborationIcon('Focused')}
          </span>
          {' Focused'}
        </IndentedButton>
      </Grid>

      <Grid item xs={12}>
        <IndentedButton
          aria-label="Set Collaboration to Open To Collaboration"
          onClick={() => { onDialogClose('Open To Collaboration') }}
          color="primary"
        >
          <span className={iconTweakStyle}>
            {rawCollaborationIcon('Open To Collaboration')}
          </span>
          {' Open To Collaboration'}
        </IndentedButton>
      </Grid>

      <Grid item xs={12}>
        <IndentedButton
          aria-label="Set Collaboration to Currently Collaborating"
          onClick={() => { onDialogClose('Currently Collaborating') }}
          color="primary"
        >
          <span className={iconTweakStyle}>
            {rawCollaborationIcon('Currently Collaborating')}
          </span>
          {' Collaborating'}
        </IndentedButton>
      </Grid>

    </Grid>
  )
}
