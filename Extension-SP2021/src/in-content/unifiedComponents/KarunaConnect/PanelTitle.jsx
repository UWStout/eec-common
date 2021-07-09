import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton } from '@material-ui/core'

import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  rootStyle: {
    position: 'absolute',
    width: `calc(100% - ${theme.spacing(4)})`,
    borderBottom: '3px solid grey',
    backgroundColor: 'white'
  },
  itemStyle: {
    display: 'flex',
    alignItems: 'center'
  }
}))

export default function PanelTitle (props) {
  const { title, arrow, onClose } = props
  const { rootStyle, itemStyle } = useStyles()

  // Callback for when the close arrow is clicked
  const closeCallback = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <Grid container spacing={1} className={rootStyle}>
      {arrow === 'left' && (
        <Grid item xs={2} className={itemStyle}>
          <IconButton aria-label='close panel' size='small' onClick={closeCallback}>
            <KeyboardArrowLeft />
          </IconButton>
        </Grid>
      )}
      <Grid item xs={arrow === 'none' ? 12 : 10} className={itemStyle}>
        <Typography aria-label='title' variant='h6'>
          {title}
        </Typography>
      </Grid>
      {arrow === 'right' && (
        <Grid item xs={2} className={itemStyle} onClick={closeCallback}>
          <IconButton aria-label='close panel' size='small'>
            <KeyboardArrowRight />
          </IconButton>
        </Grid>
      )}
    </Grid>
  )
}

PanelTitle.propTypes = {
  title: PropTypes.string.isRequired,
  arrow: PropTypes.string,
  onClose: PropTypes.func
}

PanelTitle.defaultProps = {
  arrow: 'right',
  onClose: null
}
