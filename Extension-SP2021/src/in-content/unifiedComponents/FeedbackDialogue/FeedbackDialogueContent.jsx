import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Grid } from '@material-ui/core'

import FeedbackDialogueObservation from './FeedbackDialogueObservation.jsx'
import FeedbackDialogueDetails from './FeedbackDialogueDetails.jsx'

function FeedbackDialogueContent (props) {
  const [seeDetails, setSeeDetails] = useState(false)
  const [title, setTitle] = useState('')

  return (
    <Grid container spacing={1} >
      <Grid item>
        {seeDetails
          ? <FeedbackDialogueDetails title={title} />
          : <FeedbackDialogueObservation setTitle={setTitle} setSeeDetails={setSeeDetails} />}
      </Grid>
    </Grid>
  )
}

FeedbackDialogueContent.propTypes = {

}

export default FeedbackDialogueContent
