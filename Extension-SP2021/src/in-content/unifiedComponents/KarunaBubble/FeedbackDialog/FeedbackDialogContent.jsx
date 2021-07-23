import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { KarunaMessageState } from '../../data/globalState.js'

import { Grid } from '@material-ui/core'

import FeedbackDialogAffectSurvey from './FeedbackDialogAffectSurvey.jsx'
import FeedbackDialogMessage from './FeedbackDialogMessage.jsx'
import ListNVCElements from '../../NVCInfoSections/ListNVCElements.jsx'

export default function FeedbackDialogContent (props) {
  // Deconstruct the props
  const { onHide, cancelHide } = props

  // Displayed state
  const [displayedFeedback, setDisplayedFeedback] = useState('affectSurvey')
  // Register to global state changes
  const karunaMessage = useRecoilValue(KarunaMessageState)
  useEffect(() => {
    if (karunaMessage?.content) {
      setDisplayedFeedback('karunaMessage')
    }
  }, [karunaMessage, setDisplayedFeedback])

  return (
    <Grid container spacing={1} >
      <Grid item onMouseEnter={cancelHide} onMouseLeave={() => onHide(false)}>
        {displayedFeedback === 'observations' &&
          <ListNVCElements fromBubble />}

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
