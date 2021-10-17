import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter, UserAffectIDState } from '../data/globalSate/userState.js'
import { AffectListState } from '../data/globalSate/teamState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormControlLabel, Checkbox } from '@material-ui/core'

import CaptionedButton from '../Shared/CaptionedButton.jsx'

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
  const { privacyCallback, noOptOut } = props
  const { gridBoxStyle, checkboxLabelStyle } = useStyles()

  // Global data states
  const affectId = useRecoilValue(UserAffectIDState)
  const emojiList = useRecoilValue(AffectListState)
  const privacy = useRecoilValue(PrivacyPrefsStateSetter)

  // Track last button clicked
  const [localPrivate, setLocalPrivate] = useState(undefined)

  // Track local checkbox state
  const [promptState, setPromptState] = useState(privacy.noPrompt || false)
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

  // Set button color
  let yesColor = 'default'
  let noColor = 'default'
  if (noOptOut && localPrivate !== undefined) {
    yesColor = (localPrivate ? 'default' : 'primary')
    noColor = (localPrivate ? 'primary' : 'default')
  }

  return (
    <Grid container item spacing={3}>
      <Grid item xs={12}>
        <Typography variant="body1">
          {'Do you want to share "'}
          {!affectObj
            ? '[error, unknown affect id]'
            : `${affectObj.characterCodes[0]} ${affectObj.name}`}
          {'" with the rest of the team?'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CaptionedButton
          buttonText={'Yes, Share'}
          color={yesColor}
          onClick={() => { setLocalPrivate(false); onDialogClose(false, { private: false, prompt: promptState }) }}
        >
          {'No one outside your team will be able to see the information you\'re sharing.'}
        </CaptionedButton>
      </Grid>

      <Grid item xs={12}>
        <CaptionedButton
          buttonText={'No, Keep Private'}
          color={noColor}
          onClick={() => { setLocalPrivate(true); onDialogClose(false, { private: true, prompt: promptState }) }}
        >
          {'Please consider sharing your response with your team. '}
          {'By doing so, you will be contributing to a more connected and compassionate team.'}
        </CaptionedButton>
      </Grid>

      {/* Option to dismiss the prompt in the future */}
      {!noOptOut &&
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
        </Grid>}
    </Grid>
  )
}

PrivacyPromptComponent.propTypes = {
  privacyCallback: PropTypes.func,
  noOptOut: PropTypes.bool
}

PrivacyPromptComponent.defaultProps = {
  privacyCallback: null,
  noOptOut: false
}
