import React from 'react'

import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import { AffectListState, UserStatusState, UserCollaborationState, PushActivityState } from '../data/globalState.js'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Link, Select, MenuItem } from '@material-ui/core'

import TimeToRespondForm from './TimeToRespondForm.jsx'
import { rawCollaborationIcon } from '../Shared/CollaborationIcon.jsx'

import { ACTIVITIES } from '../Activities/Activities.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Status Activity', 'pink', 'black')

const IndentedTextButton = withStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(2),
    cursor: 'pointer'
  }
}))(Link)

const TextButton = withStyles((theme) => ({
  root: {
    cursor: 'pointer'
  }
}))(Link)

const useStyles = makeStyles((theme) => ({
  iconTweakStyle: {
    position: 'relative',
    top: '0.125em',
    marginRight: theme.spacing(1)
  },
  indentLeft: {
    marginLeft: theme.spacing(2)
  }
}))

function makeCollaboration (collaboration, iconTweakStyle) {
  return (
    <React.Fragment>
      <span className={iconTweakStyle}>{rawCollaborationIcon(collaboration)}</span>
      {collaboration ? ` ${collaboration}` : ' unknown'}
    </React.Fragment>
  )
}

export default function UserStatusDetails (props) {
  const { iconTweakStyle, indentLeft } = useStyles()

  // Subscribe to the global emojiList state and current status states (GLOBAL STATE)
  const emojiList = useRecoilValue(AffectListState)
  const currentStatus = useRecoilValue(UserStatusState)
  const [collaboration, setCollaboration] = useRecoilState(UserCollaborationState)

  // Setter to push a new activity
  const pushActivity = useSetRecoilState(PushActivityState)

  // Lookup the affect object for the current affectID
  const currentAffect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  // Open the affect survey by pushing its activity
  const openAffectSurvey = () => {
    pushActivity(ACTIVITIES.AFFECT_SURVEY.key)
  }

  // Change Collaboration Status
  const onChangeCollaboration = (e) => {
    setCollaboration(e.target.value)
  }

  // Change time to respond
  const onChangeMoreSettings = () => {
    pushActivity(ACTIVITIES.MORE_USER_SETTINGS.key)
  }

  return (
    <Grid item container xs={12} spacing={2}>

      {/* Affect / Mood */}
      <Grid item xs={12}>
        <Typography variant="body1">
          {'I\'m feeling: '}
          <br />
          <IndentedTextButton aria-label={'Change Current Mood'} onClick={openAffectSurvey}>
            {(currentAffect ? currentAffect.characterCodes[0] : '?')}
            {' '}
            {(currentAffect ? currentAffect.name : 'unknown')}
          </IndentedTextButton>
        </Typography>
      </Grid>

      {/* Willingness to collaborate */}
      <Grid item xs={12}>
        <Typography variant="body1">
          {'I\'m: '}
        </Typography>
        <Select aria-label="Change Collaboration Status" value={collaboration} onChange={onChangeCollaboration} className={indentLeft}>
          <MenuItem value={'Focused'}>{makeCollaboration('Focused', iconTweakStyle)}</MenuItem>
          <MenuItem value={'Open to Collaboration'}>{makeCollaboration('Open to Collaboration', iconTweakStyle)}</MenuItem>
          <MenuItem value={'Currently Collaborating'}>{makeCollaboration('Currently Collaborating', iconTweakStyle)}</MenuItem>
        </Select>
      </Grid>

      {/* Time-to-respond */}
      <Grid item xs={12}>
        <Typography variant="body1">
          {'I typically respond in:'}
        </Typography>
        <TimeToRespondForm />
      </Grid>

      {/* More Settings */}
      <Grid item xs={12}>
        <TextButton aria-label="Change More Settings" onClick={onChangeMoreSettings} variant="body1">
          {'More Settings'}
        </TextButton>
      </Grid>
    </Grid>
  )
}
