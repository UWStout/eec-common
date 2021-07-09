import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'

import FeedbackDialogueObservation from './FeedbackDialogueObservation.jsx'
import FeedbackDialogueDetails from './FeedbackDialogueDetails.jsx'

function FeedbackDialogueContent (props) {
  const [seeDetails, setSeeDetails] = useState(false)
  const [title, setTitle] = useState('')
  const { hideTimeout, setHideTimeout, hidden, onHide, waitToHide } = props

  // Function for queueing a hide request
  const hide = (immediate) => {
    console.log('hide called')
    if (onHide && !hidden) {
      if (immediate) {
        onHide()
      } else {
        const timeoutHandle = setTimeout(() => { onHide() }, waitToHide)
        setHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHide = () => {
    console.log('cancel hide called')
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(false)
    }
  }

  return (
    <Grid container spacing={1} >
      <Grid item onMouseEnter={cancelHide} onMouseLeave={() => hide(false)}>
        {seeDetails
          ? <FeedbackDialogueDetails title={title} />
          : <FeedbackDialogueObservation setTitle={setTitle} setSeeDetails={setSeeDetails} />}
      </Grid>
    </Grid>
  )
}

FeedbackDialogueContent.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  /** Milliseconds to wait before hiding the panel */
  waitToHide: PropTypes.number
}

FeedbackDialogueContent.defaultProps = {
  waitToHide: 3000
}

export default FeedbackDialogueContent
