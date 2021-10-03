import React from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AffectListState } from '../data/globalSate/teamState.js'
import { UserStatusState } from '../data/globalSate/userState.js'
import { DisableInputState } from '../data/globalSate/appState.js'
import { PushConnectActivityState } from '../data/globalSate/connectActivityState.js'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import InternalLink from '../Shared/InternalLink.jsx'
import TimeToRespondForm from './TimeToRespondForm.jsx'
import CollaborationForm from './CollaborationForm.jsx'

import { ACTIVITIES } from '../KarunaConnect/Activities/Activities.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Status Activity', 'pink', 'black')

const IndentedTextButton = withStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(2),
    cursor: 'pointer'
  }
}))((props) => (<InternalLink variant="body1" component="span" {...props} />))

const TextButton = withStyles((theme) => ({
  root: {
    cursor: 'pointer'
  }
}))((props) => (<InternalLink variant="body1" component="span" {...props} />))

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled
  }
}))

export default function UserStatusDetails (props) {
  const { disabledText } = useStyles()

  // Subscribe to the global emojiList state and current status states (GLOBAL STATE)
  const emojiList = useRecoilValue(AffectListState)
  const currentStatus = useRecoilValue(UserStatusState)
  const disableAllInput = useRecoilValue(DisableInputState)

  // Setter to push a new activity
  const pushActivity = useSetRecoilState(PushConnectActivityState)

  // Lookup the affect object for the current affectID
  const currentAffect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  // Open the affect survey by pushing its activity
  const openAffectSurvey = () => {
    pushActivity(ACTIVITIES.AFFECT_SURVEY.key)
  }

  // Change time to respond
  const onChangeMoreSettings = () => {
    pushActivity(ACTIVITIES.MORE_SETTINGS.key)
  }

  return (
    <Grid item container xs={12} spacing={2}>

      {/* Affect / Mood */}
      <Grid item xs={12}>
        <Typography variant="body1" className={disableAllInput ? disabledText : ''}>
          {'I\'m feeling: '}
          <br />
          <IndentedTextButton aria-label={'Change Current Mood'} onClick={openAffectSurvey} disabled={disableAllInput}>
            {(currentAffect ? currentAffect.characterCodes[0] : '?')}
            {' '}
            {(currentAffect ? currentAffect.name : 'unknown')}
          </IndentedTextButton>
        </Typography>
      </Grid>

      {/* Willingness to collaborate */}
      <Grid item xs={12}>
        <Typography variant="body1" className={disableAllInput ? disabledText : ''}>
          {'I\'m: '}
        </Typography>
        <CollaborationForm />
      </Grid>

      {/* Time-to-respond */}
      <Grid item xs={12}>
        <Typography variant="body1" className={disableAllInput ? disabledText : ''}>
          {'I typically respond in:'}
        </Typography>
        <TimeToRespondForm />
      </Grid>

      {/* More Settings */}
      <Grid item xs={12}>
        <TextButton aria-label="Change More Settings" onClick={onChangeMoreSettings} disabled={disableAllInput}>
          {'More Settings'}
        </TextButton>
      </Grid>
    </Grid>
  )
}
