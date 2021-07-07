import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography, Grid, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AffectSurveyList from './AffectSurveyList.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '-90vh',
    right: '-1vw',
    // Show a pointer hand cursor to encourage clicking
    cursor: 'pointer'
  },

  paperRoot: {
    padding: theme.spacing(2)
  },

  // Style when the panel is hidden
  feedbackHidden: {
    right: -theme.spacing(18)
  }
}))

function FeedbackDialogue (props) {
  const { hidden, onHide } = props
  const { paperRoot, root, feedbackHidden } = useStyles()
  return (
    <Grid container className={`${root} ${hidden ? feedbackHidden : null}`} >
      <Grid item>
        <Paper className={paperRoot} {...props}>
          <Grid container>
            <Grid item>
              <Tooltip>
                <Typography aria-label='title' variant='h6'>
                  {'Karuna Bubble'}
                </Typography>
                {/* <AffectSurveyList /> */}
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

FeedbackDialogue.propTypes = {
  hidden: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
}

export default FeedbackDialogue
