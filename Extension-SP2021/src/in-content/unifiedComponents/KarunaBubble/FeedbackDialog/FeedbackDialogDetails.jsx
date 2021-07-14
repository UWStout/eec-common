import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

import { Request, Need, Feeling, Observation } from './NVCElements.jsx'

const useStyles = makeStyles((theme) => ({
  rootStyle: {
    // position: 'absolute',
    // width: `calc(100% - ${theme.spacing(4)})`,
    borderBottom: '3px solid grey'
    // backgroundColor: 'white'
  },
  itemStyle: {
    display: 'flex',
    alignItems: 'center'
  },
  clickable: {
    color: '#4fa6ff',
    cursor: 'pointer'
  }
}))

function FeedbackDialogDetails (props) {
  const { title, changeDisplayedFeedback } = props
  const { rootStyle, itemStyle, clickable } = useStyles()

  // Return back to observations feedback
  function openObservations () {
    changeDisplayedFeedback('observations')
  }

  return (
    <Grid container spacing={1} >
      <Grid item xs={12} className={rootStyle}>
        <Typography aria-label='title' variant='h6'>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} className={itemStyle}>
        {title === 'Observation' && <Observation />}
        {title === 'Request' && <Request />}
        {title === 'Need' && <Need />}
        {title === 'Feeling' && <Feeling />}
      </Grid>
      <Grid item xs={12} className={clickable}>
        <p onClick={openObservations}>{'go back to NVC elements'}</p>
      </Grid>
    </Grid>
  )
}

FeedbackDialogDetails.propTypes = {
  title: PropTypes.string.isRequired,
  changeDisplayedFeedback: PropTypes.func.isRequired
}

export default FeedbackDialogDetails
