import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton } from '@material-ui/core'

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
  const { rootStyle, itemStyle } = useStyles()

  return (
    <Grid container spacing={1} className={rootStyle}>
      <Grid item xs={12} className={itemStyle}>
        <Typography aria-label='title' variant='h6'>
          {'Karuna Bubble'}
        </Typography>
      </Grid>
      <Grid item xs={12} className={itemStyle}>
        <Typography aria-label='title' variant='body'>
          {'Karuna Bubble'}
        </Typography>
      </Grid>
    </Grid>
  )
}

FeedbackDialogueDetails.propTypes = {

}

export default FeedbackDialogueDetails
