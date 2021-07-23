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
  const [displayedFeedback, setDisplayedFeedback] = useState('observations')
  // Register to global state changes
  const karunaMessage = useRecoilValue(KarunaMessageState)
  // useEffect(() => {
  //   if (karunaMessage?.content) {
  //     setDisplayedFeedback('karunaMessage')
  //   }
  // }, [karunaMessage, setDisplayedFeedback])

  const observations = []
  karunaMessage.entities.map((entity) => {
    const name = entity.entity
    if (name === 'observations') return observations.push('Observation')
    else if (name === ('feelings_need_met' || 'feeling_needs_not_met')) return observations.push('Feeling')
    else if (name === 'need') return observations.push('Need')
    else if (name === 'request') return observations.push('Request')
  })

  return (
    <Grid container spacing={1} >
      <Grid item onMouseEnter={cancelHide} onMouseLeave={() => onHide(false)}>
        {displayedFeedback === 'observations' &&
          <ListNVCElements observations={observations} fromBubble />}

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
