import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { AffectListState } from '../data/globalSate/teamState.js'
import { KarunaSettingsState } from '../data/globalSate/settingsState.js'
import { LastSelectedAffectIDState } from '../data/globalSate/appState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormControlLabel, Checkbox } from '@material-ui/core'

import CaptionedButton from '../Shared/CaptionedButton.jsx'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Privacy Activity', 'yellow', 'black')

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
  const emojiList = useRecoilValue(AffectListState)
  const karunaSettings = useRecoilValue(KarunaSettingsState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Track last button clicked
  const [localShare, setLocalShare] = useState(undefined)

  // Track local checkbox state
  const [promptCheckedState, setPromptCheckedState] = useState((!karunaSettings.enablePrivacyPrompt) || false)
  const handlePromptChange = (event) => {
    setPromptCheckedState(event.currentTarget.checked)
  }

  // Respond to the dialog closing
  const onDialogClose = (didShare, enablePrivacyPrompt) => {
    if (privacyCallback) {
      privacyCallback(didShare, enablePrivacyPrompt)
    }
  }

  // Find selected affect info
  const affectObj = emojiList.find((item) => (item._id === lastSelectedAffectID))

  // Set button color
  let yesColor = 'default'
  let noColor = 'default'
  if (noOptOut && localShare !== undefined) {
    yesColor = (localShare ? 'primary' : 'default')
    noColor = (localShare ? 'default' : 'primary')
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
          onClick={() => { setLocalShare(true); onDialogClose(true, !promptCheckedState) }}
        >
          {'No one outside your team will be able to see the information you\'re sharing.'}
        </CaptionedButton>
      </Grid>

      <Grid item xs={12}>
        <CaptionedButton
          buttonText={'No, Keep Private'}
          color={noColor}
          onClick={() => { setLocalShare(false); onDialogClose(false, !promptCheckedState) }}
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
                  checked={promptCheckedState}
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
