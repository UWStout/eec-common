import React from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { KarunaSettingsState, KarunaSettingsSyncState } from '../data/globalSate/settingsState'
import { PopConnectActivityState } from '../data/globalSate/connectActivityState'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, FormControlLabel, Switch, RadioGroup, Radio, Button, Typography } from '@material-ui/core'

import { ACTIVITIES } from '../KarunaConnect/Activities/Activities'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('Account Settings Activity', 'navy', 'white')

// Simple regex for validating emails (not foolproof)
export const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/

const useStyles = makeStyles((theme) => ({
  leftIndent1Style: {
    marginLeft: `${theme.spacing(1)}px !important`
  },
  leftIndent2Style: {
    marginLeft: `${theme.spacing(2)}px !important`
  },
  leftIndent3Style: {
    marginLeft: `${theme.spacing(3)}px !important`
  },
  captionTextStyle: {
    color: theme.palette.text.disabled
  },
  textButtonStyle: {
    color: theme.palette.primary,
    textTransform: 'none'
  }
}))

function sanitizeBool (value) {
  if (typeof value !== 'boolean') {
    return (value === 'true')
  } else {
    return value
  }
}

export default function KarunaSettingsComponent (props) {
  // Destructure style classnames
  const { leftIndent1Style, leftIndent2Style, leftIndent3Style, captionTextStyle, textButtonStyle } = useStyles()

  // Read user info from Global recoil state
  const karunaSettings = useRecoilValue(KarunaSettingsState)
  const setKarunaSettings = useSetRecoilState(KarunaSettingsSyncState)

  // Global connect activity state
  const popConnectActivity = useSetRecoilState(PopConnectActivityState)

  // Update karuna settings from event
  const onUpdateSettings = (e) => {
    const newVal = e.target.checked === undefined ? sanitizeBool(e.target.value) : e.target.checked
    const newSettings = { ...karunaSettings, [e.target.name]: newVal }
    setKarunaSettings(newSettings)
  }

  // Set all settings back to defaults
  const onResetToDefaults = () => {
    setKarunaSettings({
      enableMoodPrompt: true,
      enablePrivacyPrompt: true,
      alwaysShare: true,
      enableJITStatus: true,
      // Not yet implemented so default to false
      enableMessageFeedback: false,
      enableAutoTTR: false
    })
  }

  // Enable all dismissed prompts
  const onResetPrompts = () => {
    setKarunaSettings({
      ...karunaSettings,
      enableMoodPrompt: true,
      enablePrivacyPrompt: true
    })
  }

  // Go back one activity
  const onBack = () => {
    popConnectActivity(ACTIVITIES.KARUNA_SETTINGS.key)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button color="primary" onClick={onResetToDefaults} className={textButtonStyle}>
          {'Reset All'}
        </Button>
      </Grid>

      {/* Mood Grid */}
      <Grid item xs={12} container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">{'Mood'}</Typography>
        </Grid>
        <Grid item xs={12} className={leftIndent1Style}>
          <FormControlLabel
            control={
              <Switch
                checked={sanitizeBool(karunaSettings?.enableMoodPrompt)}
                onChange={onUpdateSettings}
                name="enableMoodPrompt"
                color="default"
              />
            }
            label="Ask me how I'm feeling"
          />
        </Grid>
        <Grid item xs={12} className={leftIndent2Style}>
          <Typography variant="body1">{'Sharing'}</Typography>
        </Grid>
        <Grid item xs={12} className={leftIndent3Style}>
          <FormControlLabel
            control={
              <Switch
                checked={sanitizeBool(karunaSettings?.enablePrivacyPrompt)}
                onChange={onUpdateSettings}
                name="enablePrivacyPrompt"
                color="default"
              />
            }
            label="Always ask if I want to share my mood"
          />
        </Grid>
        <Grid item xs={12} className={leftIndent3Style}>
          <RadioGroup
            aria-label="always or never share"
            name="alwaysShare"
            value={sanitizeBool(karunaSettings?.alwaysShare) ? 'true' : 'false'}
            onChange={onUpdateSettings}
          >
            <FormControlLabel
              value={'true'}
              control={<Radio color="default" disabled={sanitizeBool(karunaSettings?.enablePrivacyPrompt)} />}
              label="Always Share"
            />
            <FormControlLabel
              value={'false'}
              control={<Radio color="default" disabled={sanitizeBool(karunaSettings?.enablePrivacyPrompt)} />}
              label="Never Share"
            />
          </RadioGroup>
        </Grid>
      </Grid>

      <Grid item xs={12} container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">{'Status of Collaborators'}</Typography>
        </Grid>
        <Grid item xs={12} className={leftIndent1Style}>
          <FormControlLabel
            control={
              <Switch
                checked={sanitizeBool(karunaSettings?.enableJITStatus)}
                onChange={onUpdateSettings}
                name="enableJITStatus"
                color="default"
              />
            }
            label="Show messages with current collaborator statuses while typing"
          />
        </Grid>
      </Grid>

      <Grid item xs={12} container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">{'Communication Model'}</Typography>
        </Grid>
        <Grid item xs={12} className={leftIndent1Style}>
          <FormControlLabel
            control={
              <Switch
                checked={sanitizeBool(karunaSettings?.enableMessageFeedback)}
                onChange={onUpdateSettings}
                name="enableMessageFeedback"
                color="default"
              />
            }
            label="Give me feedback on my messages"
            disabled
          />
          <Typography variant="caption" className={captionTextStyle}>
            {'(coming soon)'}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6" component="h3">{'Typical Response Time'}</Typography>
        </Grid>
        <Grid item xs={12} className={leftIndent1Style}>
          <FormControlLabel
            control={
              <Switch
                checked={sanitizeBool(karunaSettings?.enableAutoTTR)}
                onChange={onUpdateSettings}
                name="enableAutoTTR"
                color="default"
              />
            }
            label="Automatically track how long it takes me to respond to messages"
            disabled
          />
          <Typography variant="caption" className={captionTextStyle}>
            {'(coming soon)'}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button color="primary" onClick={onResetPrompts} className={textButtonStyle}>
          {'Reset Confirmation Prompts'}
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={onBack}>
          {'Back to More Settings'}
        </Button>
      </Grid>
    </Grid>
  )
}
