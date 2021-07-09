import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

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
  },
  clickable: {
    cursor: 'pointer'
  }
}))

function FeedbackDialogueObservation (props) {
  const { setTitle, setSeeDetails, setSeeObservations } = props
  const classes = useStyles()

  function openDetails (title) {
    setTitle(title)
    setSeeDetails(true)
    setSeeObservations(false)
    window.dispatchEvent(new CustomEvent('resize'))
  }

  return (
    <Grid container spacing={1} >
      <Grid item className={classes.observation}>
        <Typography aria-label='title' variant='body2'>
          {'I observe the following NVC elements:'}
        </Typography>
      </Grid>
      <Grid item className={`${classes.observationItem} ${classes.clickable}`}>
        <ul >
          <li onClick={() => { openDetails('Observation') }}>Observation</li>
          <li onClick={() => { openDetails('Feeling') }}>Feeling</li>
          <li onClick={() => { openDetails('Need') }}>Need</li>
          <li onClick={() => { openDetails('Request') }}>Request</li>
        </ul>
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
  setTitle: PropTypes.func.isRequired,
  setSeeDetails: PropTypes.func.isRequired
}

export default FeedbackDialogueObservation
