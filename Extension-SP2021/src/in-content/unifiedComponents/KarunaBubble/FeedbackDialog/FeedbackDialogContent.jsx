import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { KarunaMessageQueueState, KarunaMessageDequeueState, ActiveKarunaMessageState, BubbleDisplayedFeedbackState } from '../../data/globalSate/appState.js'

import { Grid } from '@material-ui/core'

import FeedbackDialogAffectSurvey from './FeedbackDialogAffectSurvey.jsx'
import FeedbackDialogMessage from './FeedbackDialogMessage.jsx'
import ListNVCElements from '../../NVCInfoSections/ListNVCElements.jsx'

// Colorful logger (Enable if logging is needed)
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Feedback Dialog Content Component', 'orange', 'black')

export default function FeedbackDialogContent (props) {
  // Deconstruct the props
  const { onHide, cancelHide } = props

  // Register to global state changes
  const activeKarunaMessage = useRecoilValue(ActiveKarunaMessageState)
  const messageQueue = useRecoilValue(KarunaMessageQueueState)
  const dequeueMessage = useSetRecoilState(KarunaMessageDequeueState)
  const [displayedFeedback, setDisplayedFeedback] = useRecoilState(BubbleDisplayedFeedbackState)

  // Attempt to compute observations from NVC (if any)
  const observations = []
  activeKarunaMessage?.entities?.map((entity) => {
    const name = entity.entity
    if (name === 'observations' && !observations.includes('Observation')) return observations.push('Observation')
    else if (name === ('feelings_need_met' || 'feeling_needs_not_met') && !observations.includes('Feeling')) return observations.push('Feeling')
    else if (name === 'need' && !observations.includes('Need')) return observations.push('Need')
    else if (name === 'request' && !observations.includes('Request')) return observations.push('Request')
    else return null
  })

  // Determine what should be displayed for the active message
  useEffect(() => {
    if (activeKarunaMessage?.affectSurvey) {
      setDisplayedFeedback('affectSurvey')
    } else if (observations.length > 0) {
      setDisplayedFeedback('observations')
    } else {
      setDisplayedFeedback('karunaMessage')
    }
  }, [activeKarunaMessage, observations.length, setDisplayedFeedback])

  // If there's no active message but there is one in the queue, dequeue it
  useEffect(() => {
    LOG('Checking for dequeue')
    if (!activeKarunaMessage && messageQueue.length > 0) {
      dequeueMessage()
    } else {
      LOG('Nothing to do', activeKarunaMessage, messageQueue)
    }
  }, [activeKarunaMessage, messageQueue, dequeueMessage])

  return (
    <Grid container spacing={1} >
      <Grid item onMouseOver={cancelHide} onMouseLeave={() => onHide(false)}>
        {displayedFeedback === 'observations' &&
          <ListNVCElements observations={observations} fromBubble />}

        {displayedFeedback === 'affectSurvey' &&
          <FeedbackDialogAffectSurvey />}

        {(displayedFeedback === 'karunaMessage' || displayedFeedback === 'none') &&
          <FeedbackDialogMessage karunaMessage={activeKarunaMessage} />}
      </Grid>
    </Grid>
  )
}

FeedbackDialogContent.propTypes = {
  onHide: PropTypes.func.isRequired,
  cancelHide: PropTypes.func.isRequired
}
