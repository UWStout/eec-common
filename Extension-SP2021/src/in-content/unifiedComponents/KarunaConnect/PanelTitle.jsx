import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid, IconButton, Divider } from '@material-ui/core'

import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  panelTitleBox: {
    // AIW This value is the sum height of the header text, caret, and Divider.
    height: '33px',
    width: '100%'
  }
}))

export default function PanelTitle (props) {
  // Deconstruct props and style class names
  const { title, arrow, onClose } = props
  const { panelTitleBox } = useStyles()

  // Callback for when the close arrow is clicked
  const closeCallback = () => {
    if (onClose) {
      onClose()
    }
  }

  // Return the proper MUI elements
  return (
    <Grid role={'heading'} aria-label={'Panel Title'} item container xs={12}>
      <div className={panelTitleBox}>
        <Grid container>
          <Grid item container xs={12}>
            {arrow === 'left' && (
              // AIW MUI documentation says justify is deprecated and to use justifyContent, however this doesn't work for our project.
              // https://material-ui.com/api/grid/
              // SFB: Looks like it's cause we weren't on the latest MUI 4 version. Fixed with MUI update
              <Grid item container alignItems='center' justifyContent='flex-end' xs={2}>
                <Grid item>
                  <IconButton aria-label='Close Panel' size='small' onClick={closeCallback}>
                    <KeyboardArrowLeft />
                  </IconButton>
                </Grid>
              </Grid>
            )}
            <Grid item xs={arrow === 'none' ? 12 : 10}>
              <Typography aria-label='title' variant='h1'>
                {title}
              </Typography>
            </Grid>
            {arrow === 'right' && (
              // AIW MUI documentation says justify is deprecated and to use justifyContent, however this doesn't work for our project.
              // https://material-ui.com/api/grid/
              <Grid item container alignItems='center' justifyContent='flex-end' xs={2} onClick={closeCallback}>
                <Grid item>
                  <IconButton aria-label='Close Panel' size='small'>
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
      </div>
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
