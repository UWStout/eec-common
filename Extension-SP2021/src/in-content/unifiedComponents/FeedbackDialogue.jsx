import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AffectSurveyList from './AffectSurveyList.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '-90vh',
    right: '1vw',
    // Show a pointer hand cursor to encourage clicking
    cursor: 'pointer'
  },

  // Style when the panel is hidden
  feedbackHidden: {
    right: -theme.spacing(18)
  }
}))

function FeedbackDialogue (props) {
  const { hidden, onHide } = props
  const { root, feedbackHidden } = useStyles()
  return (
    <div className={`${root} ${hidden ? feedbackHidden : null}`} >
      <Paper>
        <Typography aria-label='title' variant='h6'>
          {'Karuna Bubble'}
        </Typography>
        {/* <AffectSurveyList /> */}
      </Paper>
    </div>
  )
}

FeedbackDialogue.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
}

export default FeedbackDialogue
