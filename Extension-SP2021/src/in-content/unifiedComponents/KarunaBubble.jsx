import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityState } from './data/globalState.js'

import PersistentBubble from './KarunaBubble/PersistentBubble.jsx'
import FeedbackDialogue from './KarunaBubble/FeedbackDialogue/FeedbackDialogue.jsx'

// Colorful logger
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('BUBBLE Component', 'lavender', 'black')

// The karuna dialog bubble
export default function KarunaBubble (props) {
  // De-structure props
  const { context, ...restProps } = props

  // Full state and setter for visibility of main connect panel (GLOBAL STATE)
  const setMainConnectPanelOpen = useSetRecoilState(ConnectVisibilityState)

  // Hide/Show the feedback dialog
  const [feedbackDialogueOpen, setFeedbackDialogueOpen] = useRecoilState(BubbleVisibilityState)

  // Timeout for hiding the feedback dialog
  const [feedbackHideTimeout, setFeedbackHideTimeout] = useState(false)

  // Data shared throughout the connect panel is managed here
  const [contextIndicator, setContextIndicator] = useState(true)

  // Ensure the main connect panel is closed any time we open the feedback dialog
  const openCloseFeedbackDialog = (open) => {
    if (open) {
      setMainConnectPanelOpen(false)
    }
    setFeedbackDialogueOpen(open)
  }

  // Hide the feedback dialog (possibly after a set timeout)
  const hideFeedbackDialogue = (immediate) => {
    if (feedbackDialogueOpen) {
      if (immediate) {
        setFeedbackDialogueOpen(false)
      } else {
        const timeoutHandle = setTimeout(() => { setFeedbackDialogueOpen(false) }, 3000)
        setFeedbackHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHideFeedbackDialogue = () => {
    if (feedbackHideTimeout) {
      clearTimeout(feedbackHideTimeout)
      setFeedbackHideTimeout(false)
    }
  }

  // Main render
  return (
    <FeedbackDialogue
      hidden={!feedbackDialogueOpen}
      onHide={hideFeedbackDialogue}
      cancelHide={cancelHideFeedbackDialogue}
      {...restProps}
    >
      <PersistentBubble
        isContextIndicated={contextIndicator}
        hidden={!feedbackDialogueOpen}
        setOpen={openCloseFeedbackDialog}
        onHide={hideFeedbackDialogue}
        cancelHide={cancelHideFeedbackDialogue}
      />
    </FeedbackDialogue>
  )
}

KarunaBubble.propTypes = {
  context: PropTypes.string.isRequired
}
