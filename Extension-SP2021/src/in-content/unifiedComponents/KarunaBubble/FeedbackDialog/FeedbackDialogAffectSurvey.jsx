import React, { useState } from 'react'

import { useRecoilValue } from 'recoil'
import { AffectListState } from '../../data/globalSate/teamState.js'
import { UserStatusState } from '../../data/globalSate/userState.js'
import { PrivacyPrefsState } from '../../data/globalSate/appState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyList from '../../Activities/AffectSurvey/AffectSurveyList.jsx'
import PrivacyDialog from '../../Activities/AffectSurvey/PrivacyDialog.jsx'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray'
  }
}))

function FeedbackDialogAffectSurvey (props) {
  const classes = useStyles()

  // Subscribe to the global emojiList state and current status (GLOBAL STATE)
  const emojiList = useRecoilValue(AffectListState)
  const currentStatus = useRecoilValue(UserStatusState)
  const affectPrivacy = useRecoilValue(PrivacyPrefsState)

  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)

  // Lookup the affect from the list
  const affect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  // Render only the privacy dialog if it is open
  if (privacyDialogOpen) {
    return (
      <PrivacyDialog
        onClose={() => { setPrivacyDialogOpen(false) }}
        privacy={affectPrivacy}
      />
    )
  }

  // Render the normal affect survey prompt
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography variant={'body1'} className={classes.title}>
          {"Which option best describes how you're feeling?"}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant={'body2'} className={classes.title}>
          {`Previous response: ${affect ? affect.characterCodes[0] : '?'}`}
        </Typography>
      </Grid>
      <Grid item>
        <AffectSurveyList
          onBubbleOpenSurvey={() => setPrivacyDialogOpen(true)}
          onDismissSurvey={() => { setPrivacyDialogOpen(false) }}
        />
      </Grid>
    </Grid>
  )
}

export default FeedbackDialogAffectSurvey
