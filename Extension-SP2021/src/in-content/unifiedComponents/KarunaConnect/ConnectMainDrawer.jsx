import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Paper, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import PanelTitle from './PanelTitle.jsx'
import ConnectMainContent from './ConnectMainContent.jsx'

// DEBUG: Enable this logger when needed
// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Main Panel', 'lime', 'black')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: '20vh',
    width: '288px',
    // AIW Placeholder styling for testing - I've not calculated this dimension yet.
    height: '608px',

    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    )
  },

  // Style when the panel is retracted
  panelRetracted: {
    // AIW Comment in for testing styling
    // right: '0%'
    right: 'calc(0% - 109px)'
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    // AIW Comment in for testing styling
    // right: '0%'
    right: 'calc(0% - 8px)'
  },

  // Style when the panel is hidden
  panelHidden: {
    // AIW Comment in for testing styling
    // right: '0%'
    right: 'calc(0% - 312px)'
  },

  // Styling of Grid container
  gridContRoot: {
    flexGrow: 1
  }
}))

/**
 * The main drawer/side-sheet for the connect panel showing info about
 * the current user's status, their team's status, and more with
 * functionality to update the current user's status.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectMainDrawer (props) {
  const { hidden, onHide, waitToHide } = props

  // Deconstruct props and style class names
  const {
    root,
    panelHidden,
    panelRetracted,
    panelExpanded
  } = useStyles()

  // Hover state of mouse
  const [mouseIsOver, setMouseIsOver] = useState(false)

  // Handle to the pending hide request (if any)
  const [hideTimeout, setHideTimeout] = useState(false)

  // Handle to the pending retract request (if any)
  const [retractTimeout, setRetractTimeout] = useState(false)
  const [isRetracted, setIsRetracted] = useState(false)

  // Function for queueing a hide request
  const hide = (immediate) => {
    if (onHide && !hidden) {
      if (immediate) {
        onHide()
      } else {
        const timeoutHandle = setTimeout(() => { onHide() }, waitToHide)
        setHideTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending hide request
  const cancelHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(false)
    }
  }

  // Function for queueing a retract request
  const retract = (immediate) => {
    if (!isRetracted) {
      if (immediate) {
        setIsRetracted(true)
      } else {
        const timeoutHandle = setTimeout(() => { setIsRetracted(true) }, waitToHide / 2)
        setRetractTimeout(timeoutHandle)
      }
    }
  }

  // Function for canceling a pending retract request
  const cancelRetract = () => {
    if (retractTimeout) {
      clearTimeout(retractTimeout)
      setRetractTimeout(false)
      setIsRetracted(false)
    }
  }

  // Return the proper MUI elements
  return (
    <Paper
      data-testid="connectMainDrawer"
      elevation={5}
      className={`${root} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : (isRetracted ? panelRetracted : panelExpanded))}`}
      onMouseEnter={() => { setMouseIsOver(true); cancelHide(); cancelRetract() }}
      onMouseLeave={() => { setMouseIsOver(false); hide(false); retract(false) }}
    >
      <Grid container>
        <PanelTitle title='Karuna Connect' arrow='right' onClose={() => { hide(true) }} />
        <ConnectMainContent hidden={hidden} retracted={!mouseIsOver} />
      </Grid>
    </Paper>
  )
}

ConnectMainDrawer.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func,

  /** Milliseconds to wait before hiding the panel */
  waitToHide: PropTypes.number
}

ConnectMainDrawer.defaultProps = {
  hidden: false,
  onHide: null,
  waitToHide: 3000
}
