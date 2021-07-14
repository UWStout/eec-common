import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'

import FeedbackDialogObservation from './FeedbackDialogObservation.jsx'
import FeedbackDialogDetails from './FeedbackDialogDetails.jsx'
import FeedbackDialogAffectSurvey from './FeedbackDialogAffectSurvey.jsx'
export default function FeedbackDialogContent (props) {
  // Deconstruct the props
  const { onHide, cancelHide, ...restProps } = props

  // Displayed state
  const [displayedFeedback, setDisplayedFeedback] = useState('affectSurvey')
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
          <FeedbackDialogObservation
            changeDisplayedFeedback={changeDisplayedFeedback}
            setTitle={setTitle}
          />}

        {displayedFeedback === 'details' &&
          <FeedbackDialogDetails
            changeDisplayedFeedback={changeDisplayedFeedback}
            title={title}
          />}

        {displayedFeedback === 'affectSurvey' &&
          <FeedbackDialogAffectSurvey
            changeDisplayedFeedback={changeDisplayedFeedback}
            {...restProps}
          />}
      </Grid>
    </Grid>
  )
}

FeedbackDialogContent.propTypes = {
  onHide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired
}
