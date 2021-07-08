import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  itemStyle: {
    display: 'flex',
    alignItems: 'center'
  },
  observation: {
    color: 'gray'
  },
  observationItem: {
    color: '#4fa6ff'
  }
}))

function FeedbackDialogueObservation (props) {
  const { observation, observationItem } = useStyles()

  return (
    <Grid container spacing={1} >
      <Grid item className={observation}>
        <Typography aria-label='title' variant='body'>
          {'I observe the following NVC elements:'}
        </Typography>
      </Grid>
      <Grid item className={observationItem}>
        <p>
          <ul>
            <li>Observation</li>
            <li>Feeling</li>
            <li>Need</li>
            <li>Request</li>
          </ul>
        </p>
        <p>
          What other elements could I use?
          <br />
          More about NVC
        </p>
      </Grid>
    </Grid>
  )
}

FeedbackDialogueObservation.propTypes = {

}

export default FeedbackDialogueObservation
