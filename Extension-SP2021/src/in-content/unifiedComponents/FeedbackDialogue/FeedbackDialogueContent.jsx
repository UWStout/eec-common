import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'

import FeedbackDialogueObservation from './FeedbackDialogueObservation.jsx'
import FeedbackDialogueDetails from './FeedbackDialogueDetails.jsx'
import AffectSurveyList from '../AffectSurveyList.jsx'

function FeedbackDialogueContent (props) {
  const { title, setTitle, setSeeDetails, setSeeAffectSurvey, setSeeObservations, seeAffectSurvey, seeObservations, seeDetails, onHide, cancelHide } = props

  return (
    <Grid container spacing={1} >
      <Grid item onMouseEnter={cancelHide} onMouseLeave={() => onHide(false)}>
        {seeObservations ? <FeedbackDialogueObservation setTitle={setTitle} setSeeObservations={setSeeObservations} setSeeDetails={setSeeDetails} /> : null}
        {seeDetails ? <FeedbackDialogueDetails title={title} setSeeObservations={setSeeObservations} setSeeDetails={setSeeDetails} /> : null}
        {seeAffectSurvey ? <AffectSurveyList {...props} /> : null}
      </Grid>
    </Grid>
  )
}

FeedbackDialogueContent.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired,
  seeAffectSurvey: PropTypes.bool,
  seeObservations: PropTypes.bool,
  seeDetails: PropTypes.bool
}

FeedbackDialogueContent.defaultProps = {
  seeObservations: true,
  seeAffectSurvey: false,
  seeDetails: false
}

export default FeedbackDialogueContent
