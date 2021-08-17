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
  const { itemStyle } = useStyles()

  return (
    <Grid container spacing={1} >
      <Grid item xs={12} className={itemStyle}>
        <Typography variant="body1">
          {karunaMessage?.content && karunaMessage.content !== '' &&
            karunaMessage.content}
          {!(karunaMessage?.content) &&
            'All is well!'}
        </Typography>
      </Grid>
    </Grid>
  )
}

FeedbackDialogMessage.propTypes = {
  karunaMessage: PropTypes.shape({
    content: PropTypes.string
  })
}

FeedbackDialogMessage.defaultProps = {
  karunaMessage: null
}

export default FeedbackDialogMessage
