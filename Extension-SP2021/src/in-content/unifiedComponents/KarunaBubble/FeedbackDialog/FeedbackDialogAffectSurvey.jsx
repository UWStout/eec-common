import React, { useState, Suspense } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { AffectListState } from '../../data/globalSate/teamState.js'
import { UserStatusState, PrivacyPrefsState } from '../../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyActivitySkeleton from '../../Activities/AffectSurvey/AffectSurveyActivitySkeleton.jsx'
import AffectSurveyConnectActivity from '../../Activities/AffectSurvey/AffectSurveyConnectActivity.jsx'
import PrivacyDialog from '../../Activities/AffectSurvey/PrivacyDialog.jsx'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray'
  }
}))

export default function FeedbackDialogAffectSurvey (props) {
  // Process prompts and styles
  const { promptText } = props
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
          {promptText}
        </Typography>
      </Grid>
      <Suspense fallback={<AffectSurveyActivitySkeleton />}>
        <AffectSurveyConnectActivity />
      </Suspense>
    </Grid>
  )
}

FeedbackDialogAffectSurvey.propTypes = {
  promptText: PropTypes.string
}

FeedbackDialogAffectSurvey.defaultProps = {
  promptText: 'Which option best describes how you\'re feeling?'
}
