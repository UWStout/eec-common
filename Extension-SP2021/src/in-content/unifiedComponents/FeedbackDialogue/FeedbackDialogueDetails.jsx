import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

import { Request, Need, Feeling, Observation } from './NVCelements.jsx'

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

function FeedbackDialogueDetails (props) {
  const { title, setSeeDetails, setSeeObservations } = props
  const { rootStyle, itemStyle, clickable } = useStyles()

  function openObservations () {
    setSeeDetails(false)
    setSeeObservations(true)
  }

  return (
    <Grid container spacing={1} >
      <Grid item xs={12} className={rootStyle}>
        <Typography aria-label='title' variant='h6'>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} className={itemStyle}>
        {title === 'Observation' ? <Observation /> : null}
        {title === 'Request' ? <Request /> : null}
        {title === 'Need' ? <Need /> : null}
        {title === 'Feeling' ? <Feeling /> : null}
      </Grid>
      <Grid item xs={12} spacing={1} className={clickable}>
        <p onClick={openObservations}>go back to NVC elements</p>
      </Grid>
    </Grid>
  )
}

FeedbackDialogueDetails.propTypes = {
  title: PropTypes.string.isRequired
}

export default FeedbackDialogueDetails
