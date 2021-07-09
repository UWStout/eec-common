import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'

import FeedbackDialogueObservation from './FeedbackDialogueObservation.jsx'
import FeedbackDialogueDetails from './FeedbackDialogueDetails.jsx'
import AffectSurveyList from '../../AffectSurvey/AffectSurveyList.jsx'

export default function FeedbackDialogueContent (props) {
  // Deconstruct the props
  const { onHide, cancelHide, ...restProps } = props

  // Displayed state
  const [displayedFeedback, setDisplayedFeedback] = useState('observations')
  const [title, setTitle] = useState('karuna')

  // Trigger a resize event every time the feedback content changes
  const changeDisplayedFeedback = (newFeedback) => {
    setDisplayedFeedback(newFeedback)
    window.dispatchEvent(new CustomEvent('resize'))
  }

  return (
    <Grid container spacing={1} >
      <Grid item onMouseEnter={cancelHide} onMouseLeave={() => onHide(false)}>
        {displayedFeedback === 'observations' &&
          <FeedbackDialogueObservation
            changeDisplayedFeedback={changeDisplayedFeedback}
            setTitle={setTitle}
          />}

        {displayedFeedback === 'details' &&
          <FeedbackDialogueDetails
            changeDisplayedFeedback={changeDisplayedFeedback}
            title={title}
          />}

        {displayedFeedback === 'affectSurvey' &&
          <AffectSurveyList
            changeDisplayedFeedback={changeDisplayedFeedback}
            {...restProps}
          />}
      </Grid>
    </Grid>
  )
}

FeedbackDialogueContent.propTypes = {
  onHide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired
}
