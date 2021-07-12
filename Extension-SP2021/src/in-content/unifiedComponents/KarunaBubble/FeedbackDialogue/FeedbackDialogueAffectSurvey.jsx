import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import AffectSurveyList from '../../AffectSurvey/AffectSurveyList.jsx'
import { StatusObjectShape, AffectObjectShape } from '../../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'gray'
  }
}))

function FeedbackDialogueAffectSurvey (props) {
  const classes = useStyles()
  const { changeDisplayedFeedback, emojiList, currentStatus, ...restProps } = props

  // Lookup the affect from the list
  const affect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

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
          changeDisplayedFeedback={changeDisplayedFeedback}
          emojiList={emojiList}
          currentStatus={currentStatus}
          {...restProps}
        />
      </Grid>
    </Grid>
  )
}

FeedbackDialogueAffectSurvey.propTypes = {
  changeDisplayedFeedback: PropTypes.func.isRequired,
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)).isRequired,
  currentStatus: PropTypes.shape(StatusObjectShape)
}

FeedbackDialogueAffectSurvey.defaultProps = {
  currentStatus: null
}

export default FeedbackDialogueAffectSurvey
