import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter } from '../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormGroup, FormControlLabel, Button, Checkbox } from '@material-ui/core'

import ExternalLink from '../Shared/ExternalLink.jsx'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Privacy Activity', 'yellow', 'black')

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

export default function PrivacyPromptComponent (props) {
  const { privacyCallback } = props
  const classes = useStyles()

  // Global data states
  const privacy = useRecoilValue(PrivacyPrefsStateSetter)

  // Track local checkbox state
  const [promptState, setPromptState] = useState(privacy.prompt)
  const handlePromptChange = (event) => {
    setPromptState(event.currentTarget.checked)
  }

  // Respond to the dialog closing
  const onDialogClose = (canceled, newPrivacy) => {
    if (privacyCallback) {
      privacyCallback(canceled, newPrivacy)
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

PrivacyPromptComponent.propTypes = {
  privacyCallback: PropTypes.func
}

PrivacyPromptComponent.defaultProps = {
  privacyCallback: null
}
