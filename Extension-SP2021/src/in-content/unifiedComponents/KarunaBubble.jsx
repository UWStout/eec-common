/* global EventEmitter3 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityStateSetter } from './data/globalSate/appState.js'
import { PushBubbleActivityState, BubbleActiveStatusMessageState } from './data/globalSate/bubbleActivityState.js'

import BubbleActivityDialog from './KarunaBubble/BubbleActivityDialog.jsx'
import { ACTIVITIES } from './KarunaBubble/Activities/Activities.js'

// Colorful logger (Enable if logging is needed)
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('BUBBLE Component', 'lavender', 'black')

// The karuna dialog bubble
export default function KarunaBubble (props) {
  const { emitter } = props

  // Track karuna server messages globally
  const pushBubbleActivity = useSetRecoilState(PushBubbleActivityState)
  const setActiveStatusMessage = useSetRecoilState(BubbleActiveStatusMessageState)
  useEffect(() => {
    emitter.on('karunaMessage', (newMessage) => {
      // What type of message is this?
      let activityKey = ACTIVITIES.BLANK_MESSAGE.key
      if (newMessage?.affectSurvey) {
        activityKey = ACTIVITIES.AFFECT_SURVEY.key
      } else if (newMessage?.observations?.length > 0) {
        activityKey = ACTIVITIES.WATSON_MESSAGE.key
      } else if (newMessage) {
        activityKey = ACTIVITIES.KARUNA_MESSAGE.key
      }

      // Build and push the activity
      const newActivity = {
        key: activityKey,
        message: newMessage
      }
      LOG('Adding activity to bubble queue:', newActivity)
      pushBubbleActivity(newActivity)
    })

    // Build the status message activity
    // NOTE: This will automatically update message of previous activity
    emitter.on('statusMessage', (message) => {
      pushBubbleActivity({
        key: ACTIVITIES.STATUS_MESSAGE.key,
        message: message
      })
      setActiveStatusMessage(message)
    })
  }, [emitter, pushBubbleActivity, setActiveStatusMessage])

  // Full state and setter for visibility of main connect panel (GLOBAL STATE)
  const setMainConnectPanelOpen = useSetRecoilState(ConnectVisibilityState)

  // Hide/Show the feedback dialog
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useRecoilState(BubbleVisibilityStateSetter)

  // Timeout for hiding the feedback dialog
  const [feedbackHideTimeout, setFeedbackHideTimeout] = useState(false)

  // Ensure the main connect panel is closed any time we open the feedback dialog
  const openCloseFeedbackDialog = (open) => {
    if (open) {
      setMainConnectPanelOpen(false)
    }

    setFeedbackDialogOpen(open)
  }

  // Hide the feedback dialog (possibly after a set timeout)
  const hideFeedbackDialog = (immediate) => {
    if (feedbackDialogOpen) {
      if (immediate) {
        setFeedbackDialogOpen(false)
      } else {
        LOG('Hide Requested')
        const timeoutHandle = setTimeout(() => { setFeedbackDialogOpen(false) }, 3000)
        setFeedbackHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHideFeedbackDialog = () => {
    if (feedbackHideTimeout) {
      LOG('Hide Canceled')
      clearTimeout(feedbackHideTimeout)
      setFeedbackHideTimeout(false)
    }
  }

  // Main render
  return (
    <BubbleActivityDialog
      hidden={!feedbackDialogOpen}
      setOpen={openCloseFeedbackDialog}
      requestHide={hideFeedbackDialog}
      cancelHide={cancelHideFeedbackDialog}
    />
  )
}

KarunaBubble.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3)
}

KarunaBubble.defaultProps = {
  emitter: null
}
