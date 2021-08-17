import React, { useState, useEffect } from 'react'

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityStateSetter, ActiveKarunaMessageState, BubbleDisplayedFeedbackState } from './data/globalState.js'

import PersistentBubble from './KarunaBubble/PersistentBubble.jsx'
import FeedbackDialog from './KarunaBubble/FeedbackDialog/FeedbackDialog.jsx'

// Colorful logger (Enable if logging is needed)
// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('BUBBLE Component', 'lavender', 'black')

// The karuna dialog bubble
export default function KarunaBubble (props) {
  // Full state and setter for visibility of main connect panel (GLOBAL STATE)
  const setMainConnectPanelOpen = useSetRecoilState(ConnectVisibilityState)

  // Hide/Show the feedback dialog
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useRecoilState(BubbleVisibilityStateSetter)
  const displayedFeedback = useRecoilValue(BubbleDisplayedFeedbackState)

  // Receive changes in the karuna message (GLOBAL STATE)
  const [activeKarunaMessage, setActiveKarunaMessage] = useRecoilState(ActiveKarunaMessageState)
  useEffect(() => {
    if (displayedFeedback === 'affectSurvey') {
      setFeedbackDialogOpen(true)
      window.dispatchEvent(new CustomEvent('resize'))
    } else if (activeKarunaMessage?.content) {
      setFeedbackDialogOpen(true)
    }
  }, [displayedFeedback, activeKarunaMessage, setFeedbackDialogOpen])

  // Timeout for hiding the feedback dialog
  const [feedbackHideTimeout, setFeedbackHideTimeout] = useState(false)

  // Ensure the main connect panel is closed any time we open the feedback dialog
  const openCloseFeedbackDialog = (open) => {
    if (open) {
      setMainConnectPanelOpen(false)
    } else {
      // Consume the message
      setActiveKarunaMessage(null)
    }

    setFeedbackDialogOpen(open)
  }

  // Hide the feedback dialog (possibly after a set timeout)
  const hideFeedbackDialog = (immediate) => {
    if (feedbackDialogOpen) {
      if (immediate) {
        setFeedbackDialogOpen(false)
      } else {
        const timeoutHandle = setTimeout(() => { setFeedbackDialogOpen(false) }, 3000)
        setFeedbackHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHideFeedbackDialog = () => {
    if (feedbackHideTimeout) {
      clearTimeout(feedbackHideTimeout)
      setFeedbackHideTimeout(false)
    }
  }

  // Main render
  return (
    <FeedbackDialog
      hidden={!feedbackDialogOpen}
      onHide={hideFeedbackDialog}
      cancelHide={cancelHideFeedbackDialog}
    >
      <PersistentBubble
        hidden={!feedbackDialogOpen}
        setOpen={openCloseFeedbackDialog}
        onHide={hideFeedbackDialog}
        cancelHide={cancelHideFeedbackDialog}
      />
    </FeedbackDialog>
  )
}
