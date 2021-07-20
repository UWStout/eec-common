import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

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

function FeedbackDialogMessage (props) {
  const { karunaMessage } = props
  const { rootStyle, itemStyle } = useStyles()

  // Without a message, just return an empty div
  if (!karunaMessage?.content) {
    return <div />
  }

  return (
    <Grid container spacing={1} >
      <Grid item xs={12} className={rootStyle}>
        <Typography aria-label='title' variant='h6'>
          {'Message from Karuna:'}
        </Typography>
      </Grid>
      <Grid item xs={12} className={itemStyle}>
        {karunaMessage.content}
      </Grid>
    </Grid>
  )
}

FeedbackDialogMessage.propTypes = {
  karunaMessage: PropTypes.shape({
    content: PropTypes.string
  }).isRequired
}

export default FeedbackDialogMessage
