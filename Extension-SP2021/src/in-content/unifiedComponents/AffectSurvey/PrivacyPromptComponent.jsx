import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter, UserAffectIDState } from '../data/globalSate/userState.js'
import { AffectListState } from '../data/globalSate/teamState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormControlLabel, Button, Checkbox } from '@material-ui/core'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('Privacy Activity', 'yellow', 'black')

const useStyles = makeStyles((theme) => ({
  captionStyle: {
    color: theme.palette.text.disabled
  },
  gridBoxStyle: {
    paddingLeft: `${theme.spacing(2)}px !important`
  },
  checkboxLabelStyle: {
    marginLeft: theme.spacing(1),
    fontSize: '12px'
  }
}))

export default function PrivacyPromptComponent (props) {
  const { privacyCallback } = props
  const { gridBoxStyle, captionStyle, checkboxLabelStyle } = useStyles()

  // Global data states
  const affectId = useRecoilValue(UserAffectIDState)
  const emojiList = useRecoilValue(AffectListState)
  const privacy = useRecoilValue(PrivacyPrefsStateSetter)

  // Track local checkbox state
  const [promptState, setPromptState] = useState(privacy.noPrompt)
  const handlePromptChange = (event) => {
    setPromptState(event.currentTarget.checked)
  }

  // Respond to the dialog closing
  const onDialogClose = (canceled, newPrivacy) => {
    if (privacyCallback) {
      privacyCallback(canceled, newPrivacy)
    }
  }

  // Find selected affect info
  const affectObj = emojiList.find((item) => (item._id === affectId))

  return (
    <Grid container item spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body">
          {'Do you want to share "'}
          {!affectObj
            ? '[error, unknown affect id]'
            : `${affectObj.characterCodes[0]} ${affectObj.name}`}
          {'" with the rest of the team?'}
        </Typography>
      </Grid>

      <Grid container item xs={12} spacing={1}>
        <Grid item className={gridBoxStyle} xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => { onDialogClose(false, { private: false, prompt: promptState }) }}
          >
            {'Yes, Share'}
          </Button>
        </Grid>
        <Grid item className={gridBoxStyle} xs={12}>
          <Typography className={captionStyle} variant="caption">
            {'No one outside your team will be able to see the information you\'re sharing.'}
          </Typography>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={1}>
        <Grid item className={gridBoxStyle} xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => { onDialogClose(false, { private: true, prompt: promptState }) }}
          >
            {'No, Keep Private'}
          </Button>
        </Grid>
        <Grid item className={gridBoxStyle} xs={12}>
          <Typography className={captionStyle} variant="caption">
            {'Please consider sharing your response with your team. '}
            {'By doing so, you will be contributing to a more connected and compassionate team.'}
          </Typography>
        </Grid>
      </Grid>

      {/* Option to dismiss the prompt in the future */}
      <Grid container item xs={12} spacing={1}>
        <Grid item className={gridBoxStyle} xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={promptState}
                onChange={handlePromptChange}
                color="default"
              />
            }
            label="Save my response and don't show this message again."
            classes={{ label: checkboxLabelStyle }}
          />
        </Grid>
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
