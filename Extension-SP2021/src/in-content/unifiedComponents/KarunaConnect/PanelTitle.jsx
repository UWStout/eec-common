import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton, Divider } from '@material-ui/core'

import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  // AIW Normaly setting the height on a grid container is undesirable but we don't want the height of PanelTitle to change, so I set height here rather than creating another wrapper.
  setHeight: {
    height: '33px'
  }
}))

export default function PanelTitle (props) {
  // Deconstruct props and style class names
  const { title, arrow, onClose } = props
  const { setHeight } = useStyles()

  // Callback for when the close arrow is clicked
  const closeCallback = () => {
    if (onClose) {
      onClose()
    }
  }

  // Return the proper MUI elements
  return (
    <Grid item container className={setHeight} xs={12}>
      <Grid item container xs={12}>
        {arrow === 'left' && (
          // AIW MUI documentation says justify is deprecated and to use justifyContent, however this doesn't work for our project. https://material-ui.com/api/grid/
          <Grid item container alignItems='center' justify='flex-end' xs={2}>
            <Grid item>
              <IconButton aria-label='close panel' size='small' onClick={closeCallback}>
                <KeyboardArrowLeft />
              </IconButton>
            </Grid>
          </Grid>
        )}
        <Grid item xs={arrow === 'none' ? 12 : 10}>
          <Typography aria-label='title' variant='h6'>
            {title}
          </Typography>
        </Grid>
        {arrow === 'right' && (
          // AIW MUI documentation says justify is deprecated and to use justifyContent, however this doesn't work for our project. https://material-ui.com/api/grid/
          <Grid item container alignItems='center' justify='flex-end' xs={2} onClick={closeCallback}>
            <Grid item>
              <IconButton aria-label='close panel' size='small'>
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
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
