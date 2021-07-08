import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton } from '@material-ui/core'

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
  }
}))

function FeedbackDialogueDetails (props) {
  const { title } = props
  const { rootStyle, itemStyle } = useStyles()

  return (
    <Grid container spacing={1} >
      <Grid item xs={12} className={rootStyle}>
        <Typography aria-label='title' variant='h6'>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} className={itemStyle}>
        <Typography aria-label='title' variant='body2'>
          {title === 'Observation' ? <Observation /> : null}
          {title === 'Request' ? <Request /> : null}
          {title === 'Need' ? <Need /> : null}
          {title === 'Feeling' ? <Feeling /> : null}
        </Typography>
      </Grid>
    </Grid>
  )
}

FeedbackDialogueDetails.propTypes = {
  title: PropTypes.string.isRequired
}

export default FeedbackDialogueDetails
