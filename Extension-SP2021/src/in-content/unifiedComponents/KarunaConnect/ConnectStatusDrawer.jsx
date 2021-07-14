import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Paper, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import OpenArrow from './PanelOpenArrow.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'absolute',
    top: '20vh',

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    ),

    // Show a pointer hand cursor to encourage clicking
    cursor: 'pointer'
  },

  // Styling of the root paper element
  paperRoot: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  },

  // Style when the panel is fully retracted
  panelRetracted: {
    right: 'calc(-100% + 46px)' // right: -theme.spacing(13)
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: 'calc(-100% + 90px)' // right: -theme.spacing(8) // should be 8
  },

  // Style when the panel is hidden
  panelHidden: {
    right: '-100%' // right: -theme.spacing(18)
  }
}))

/**
 * A small drawer/side-sheet with an arrow that expands when hovered to show the user's status.
 * Will transition to the main panel when clicked.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectStatusDrawer ({ hidden, onHide }) {
  // Deconstruct props and style class names
  const { root, paperRoot, panelRetracted, panelExpanded, panelHidden } = useStyles()

  // Is the mouse over this component
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Function to run when the component is clicked
  const clickCallback = () => {
    setMouseIsOver(false)
    if (onHide) { onHide() }
  }

  // Return the proper MUI elements
  return (
    <Grid
      container
      data-testid="connectStatusPanel"
      className={`${root} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
      onMouseEnter={() => { setMouseIsOver(true) }}
      onMouseLeave={() => { setMouseIsOver(false) }}
      onClick={clickCallback}
    >
      <Paper elevation={3} className={paperRoot}>
        <Grid
          container
          item
          direction='row'
          wrap="nowrap"
          spacing={4}
        >
          <Grid item xs={6}>
            <OpenArrow showDouble={mouseIsOver} flipped />
          </Grid>
          <Grid
            container
            item
            direction="column"
            wrap="nowrap"
            spacing={1}
            xs={6}
          >
            <Grid item xs={12}>
              <Typography variant='body1'>😀</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>😀</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>😀</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

ConnectStatusDrawer.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func
}

ConnectStatusDrawer.defaultProps = {
  hidden: false,
  onHide: null
}
