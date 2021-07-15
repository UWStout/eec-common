import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityState } from './data/globalState.js'

import PersistentBubble from './KarunaBubble/PersistentBubble.jsx'
import FeedbackDialog from './KarunaBubble/FeedbackDialog/FeedbackDialog.jsx'

// Colorful logger
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('BUBBLE Component', 'lavender', 'black')

// The karuna dialog bubble
export default function KarunaBubble (props) {
  // De-structure props
  const { context } = props

  // Full state and setter for visibility of main connect panel (GLOBAL STATE)
  const setMainConnectPanelOpen = useSetRecoilState(ConnectVisibilityState)

  // Hide/Show the feedback dialog
  const [FeedbackDialogOpen, setFeedbackDialogOpen] = useRecoilState(BubbleVisibilityState)

  // Timeout for hiding the feedback dialog
  const [feedbackHideTimeout, setFeedbackHideTimeout] = useState(false)

  // Data shared throughout the connect panel is managed here
  const [contextIndicator, setContextIndicator] = useState(true)

  // Ensure the main connect panel is closed any time we open the feedback dialog
  const openCloseFeedbackDialog = (open) => {
    if (open) {
      setMainConnectPanelOpen(false)
    }
    setFeedbackDialogOpen(open)
  }

  // Hide the feedback dialog (possibly after a set timeout)
  const hideFeedbackDialog = (immediate) => {
    if (FeedbackDialogOpen) {
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
      hidden={!FeedbackDialogOpen}
      onHide={hideFeedbackDialog}
      cancelHide={cancelHideFeedbackDialog}
    >
      <PersistentBubble
        isContextIndicated={contextIndicator}
        hidden={!FeedbackDialogOpen}
        setOpen={openCloseFeedbackDialog}
        onHide={hideFeedbackDialog}
        cancelHide={cancelHideFeedbackDialog}
      />
    </FeedbackDialog>
  )
}

KarunaBubble.propTypes = {
  context: PropTypes.string.isRequired
}
