import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormGroup, FormControlLabel, Button, Checkbox } from '@material-ui/core'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  PrivacyPrefsStateSetter,
  UserAffectIDState,
  LastSelectedAffectIDState,
  PopActivityState
} from '../../data/globalState.js'

import ExternalLink from '../../Shared/ExternalLink.jsx'

import { ACTIVITIES } from '../Activities.js'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Privacy Activity', 'yellow', 'black')

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray',
    borderBottom: '1px solid grey'
  },
  body: {
    color: '#4fa6ff',
    textAlign: 'center',
    cursor: 'pointer'
  }
}))

export default function PrivacyPromptActivity (props) {
  const classes = useStyles()

  // Global data states
  const [privacy, setPrivacy] = useRecoilState(PrivacyPrefsStateSetter)
  const setCurrentAffect = useSetRecoilState(UserAffectIDState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const popActivity = useSetRecoilState(PopActivityState)

  // Track local checkbox state
  const [promptState, setPromptState] = useState(privacy.prompt)
  const handlePromptChange = (event) => {
    setPromptState(event.currentTarget.checked)
  }

  // Respond to the dialog closing
  const onDialogClose = (canceled, newPrivacy) => {
    // Dismiss the privacy activity
    popActivity(ACTIVITIES.PRIVACY_PROMPT)

    if (!canceled) {
      LOG('Closing Privacy Dialog', newPrivacy)

      // Update affect and privacy
      setCurrentAffect(lastSelectedAffectID)
      setPrivacy(newPrivacy)

      // Dismiss affect survey too
      popActivity(ACTIVITIES.AFFECT_SURVEY)
    } else {
      LOG('CANCELING Privacy Dialog')
    }
  }

  return (
    <Grid container item spacing={2}>
      <Grid item className={classes.title} xs={12}>
        <Typography>
          {'Do you want to share your response with your team?'}
        </Typography>
      </Grid>

      <Grid item className={classes.body} xs={12}>
        <FormGroup row>
          <Grid container spacing={2}>
            {/* Row of buttons */}
            <Grid item xs={4}>
              <Button onClick={() => { onDialogClose(false, { private: true, prompt: promptState }) }}>
                {'No, Keep Private'}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button onClick={() => { onDialogClose(false, { private: false, prompt: promptState }) }}>
                {'Yes, Share'}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button onClick={() => { onDialogClose(true) }}>
                {'Cancel'}
              </Button>
            </Grid>

            {/* Row of Info Links */}
            <Grid item xs={4}>
              <ExternalLink href="#whyShare">{'Why Share?'}</ExternalLink>
            </Grid>
            <Grid item xs={4}>
              <ExternalLink href="#isThisSecure">
                {'Is This'}
                <br />
                {'secure?'}
              </ExternalLink>
            </Grid>
          </Grid>
        </FormGroup>
      </Grid>

      {/* Option to dismiss the prompt in the future */}
      <Grid item className={classes.body} xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={promptState} onChange={handlePromptChange} name="privacyPrompt" />}
            label="Save my response and don't show this message again."
          />
        </FormGroup>
      </Grid>
    </Grid>
  )
}
