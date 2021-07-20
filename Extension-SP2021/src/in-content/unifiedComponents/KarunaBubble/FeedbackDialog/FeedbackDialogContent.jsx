import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { KarunaMessageState } from '../../data/globalState.js'

import { Grid } from '@material-ui/core'

import FeedbackDialogObservation from './FeedbackDialogObservation.jsx'
import FeedbackDialogDetails from './FeedbackDialogDetails.jsx'
import FeedbackDialogAffectSurvey from './FeedbackDialogAffectSurvey.jsx'
import FeedbackDialogMessage from './FeedbackDialogMessage.jsx'

export default function FeedbackDialogContent (props) {
  // Deconstruct the props
  const { onHide, cancelHide } = props

  // Displayed state
  const [displayedFeedback, setDisplayedFeedback] = useState('affectSurvey')
  const [title, setTitle] = useState('karuna')

  // Register to global state changes
  const karunaMessage = useRecoilValue(KarunaMessageState)
  useEffect(() => {
    if (karunaMessage?.content) {
      setDisplayedFeedback('karunaMessage')
    }
  }, [karunaMessage, setDisplayedFeedback])

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
          <FeedbackDialogAffectSurvey />}

        {displayedFeedback === 'karunaMessage' &&
          <FeedbackDialogMessage karunaMessage={karunaMessage} />}
      </Grid>
    </Grid>
  )
}

FeedbackDialogContent.propTypes = {
  onHide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired
}
