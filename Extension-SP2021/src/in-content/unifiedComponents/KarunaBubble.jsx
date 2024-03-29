/* global EventEmitter3 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { KarunaSettingsState } from './data/globalSate/settingsState.js'
import { ConnectVisibilityState, BubbleVisibilityStateSetter } from './data/globalSate/appState.js'
import { PushBubbleActivityState, BubbleActiveStatusMessageState } from './data/globalSate/bubbleActivityState.js'

import BubbleActivityDialog from './KarunaBubble/BubbleActivityDialog.jsx'
import { OnboardingActivity } from './KarunaBubble/Activities/OnboardingActivity.js'
import { AffectSurveyActivity, AffectSurveyNoPromptActivity } from './KarunaBubble/Activities/AffectSurveyActivity.js'
import { ACTIVITIES } from './KarunaBubble/Activities/Activities.js'

// Colorful logger (Enable if logging is needed)
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('BUBBLE Component', 'lavender', 'black')

// Enable this to help with debugging
const DISABLE_HIDING = false

// The karuna dialog bubble
export default function KarunaBubble (props) {
  const { emitter } = props

  // Track karuna server messages globally
  const pushBubbleActivity = useSetRecoilState(PushBubbleActivityState)
  const setActiveStatusMessage = useSetRecoilState(BubbleActiveStatusMessageState)
  const karunaSettings = useRecoilValue(KarunaSettingsState)
  useEffect(() => {
    LOG('Registering karunaMessage listener')
    emitter.on('karunaMessage', (newMessage) => {
      // What type of message is this?
      LOG('Karuna message received', newMessage)
      let newActivity = { ...ACTIVITIES.KARUNA_MESSAGE, message: newMessage }
      if (newMessage?.needOnboarding) {
        newActivity = OnboardingActivity
      } else if (newMessage?.affectSurvey) {
        if (karunaSettings?.enablePrivacyPrompt) {
          LOG('Adding simple affect survey')
          newActivity = AffectSurveyActivity
        } else {
          LOG('Adding no-prompt affect survey')
          newActivity = AffectSurveyNoPromptActivity
        }
      } else if (newMessage?.observations?.length > 0) {
        newActivity = { ...ACTIVITIES.WATSON_MESSAGE, message: newMessage }
      }

      pushBubbleActivity(newActivity)
    })

    // Build the status message activity
    // NOTE: This will automatically update message of previous activity
    emitter.on('statusMessage', (message) => {
      pushBubbleActivity({
        ...ACTIVITIES.STATUS_MESSAGE,
        message: message
      })
      setActiveStatusMessage(message)
    })

    // Let other elements know we are ready
    emitter.emit('unifiedAppReady')
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
    if (DISABLE_HIDING) { return }
    if (feedbackDialogOpen) {
      if (immediate) {
        setFeedbackDialogOpen(false)
      } else {
        // LOG('Hide Requested')
        const timeoutHandle = setTimeout(() => { setFeedbackDialogOpen(false) }, 3000)
        setFeedbackHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHideFeedbackDialog = () => {
    if (feedbackHideTimeout) {
      // LOG('Hide Canceled')
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
