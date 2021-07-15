import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { EmojiListState, UserStatusState } from '../../data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyList from '../../AffectSurvey/AffectSurveyList.jsx'
import PrivacyDialog from '../../AffectSurvey/PrivacyDialog.jsx'
import { AffectObjectShape, PrivacyObjectShape, StatusObjectShape, DEFAULT } from '../../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray'
  }
}))

function FeedbackDialogAffectSurvey (props) {
  const classes = useStyles()
  const { changeDisplayedFeedback, affectPrivacy, updatePrivacy, updateCurrentAffect, ...restProps } = props

  // Subscribe to the global emojiList state and current status (GLOBAL STATE)
  const emojiList = useRecoilValue(EmojiListState)
  const currentStatus = useRecoilValue(UserStatusState)

  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)

  // Lookup the affect from the list
  const affect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      {privacyDialogOpen
        ? <PrivacyDialog
            onClose={() => { setPrivacyDialogOpen(false) }}
            privacy={affectPrivacy}
          />
        : <Grid container spacing={1}>
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
              {...restProps}
            />
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )
}
FeedbackDialogAffectSurvey.propTypes = {
  changeDisplayedFeedback: PropTypes.func.isRequired,
  affectPrivacy: PropTypes.shape(PrivacyObjectShape),

  updateCurrentAffect: PropTypes.func.isRequired,
  updatePrivacy: PropTypes.func.isRequired,
  noInteraction: PropTypes.bool.isRequired,
  onDismissSurvey: PropTypes.func
}

FeedbackDialogAffectSurvey.defaultProps = {
  affectPrivacy: DEFAULT.PrivacyObjectShape,
  onDismissSurvey: null
}

export default FeedbackDialogAffectSurvey
