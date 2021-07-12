import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyList from '../../AffectSurvey/AffectSurveyList.jsx'
import FeedbackDialoguePrivacy from './FeedbackDialoguePrivacy.jsx'
import { AffectObjectShape, PrivacyObjectShape, StatusObjectShape, DEFAULT } from '../../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray'
  }
}))

function FeedbackDialogueAffectSurvey (props) {
  const classes = useStyles()
  const { affectPrivacy, changeDisplayedFeedback, emojiList, currentStatus, updateCurrentAffect, updatePrivacy, ...restProps } = props

  // Lookup the affect from the list
  const affect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  const [selectedAffectID, setSelectedAffectID] = useState(currentStatus?.currentAffectID)
  const updateAndClose = async (newPrivacy) => {
    await updateCurrentAffect(selectedAffectID, newPrivacy?.private)
    await updatePrivacy(newPrivacy)
    setPrivacyDialogueOpen(false)
  }

  const [privacyDialogueOpen, setPrivacyDialogueOpen] = useState(false)
  const privacyDialogueClosed = (canceled, newPrivacy) => {
    setPrivacyDialogueOpen(false)
    if (!canceled) {
      updateAndClose(newPrivacy)
    }
  }

  const onSelection = (affect) => {
    console.log(`[[FEEDBACK AFFECT SURVEY]]: ${affect?._id} emoji selected`)
    setSelectedAffectID(affect?._id)
    if (affectPrivacy?.prompt) {
      setPrivacyDialogueOpen(true)
    } else {
      updateAndClose(affectPrivacy)
    }
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>
      {privacyDialogueOpen
        ? <FeedbackDialoguePrivacy
            onDialogueClose={privacyDialogueClosed}
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
              setFeedbackSelectedAffectID={setSelectedAffectID}
              emojiList={emojiList}
              currentStatus={currentStatus}
              onOpenSurvey={onSelection}
              onDismissSurvey={privacyDialogueClosed}
              updatePrivacy={updatePrivacy}
              {...restProps}
            />
          </Grid>
        </Grid>
      }
    </React.Fragment>
  )
}
FeedbackDialogueAffectSurvey.propTypes = {
  changeDisplayedFeedback: PropTypes.func.isRequired,
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)),
  currentStatus: PropTypes.shape(StatusObjectShape),
  moodHistoryList: PropTypes.arrayOf(PropTypes.string),
  affectPrivacy: PropTypes.shape(PrivacyObjectShape),

  updateCurrentAffect: PropTypes.func.isRequired,
  updatePrivacy: PropTypes.func.isRequired,
  noInteraction: PropTypes.bool.isRequired,
  onDismissSurvey: PropTypes.func
}

FeedbackDialogueAffectSurvey.defaultProps = {
  emojiList: [],
  moodHistoryList: [],
  currentStatus: DEFAULT.StatusObjectShape,
  affectPrivacy: DEFAULT.PrivacyObjectShape,
  onDismissSurvey: null
}

export default FeedbackDialogueAffectSurvey
