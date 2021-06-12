import React from 'react'
import PropTypes from 'prop-types'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import OpenArrow from './OpenArrow.jsx'

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  paperRoot: {
    // Margins and sizing
    margin: theme.spacing(1),
    width: theme.spacing(16),
    height: theme.spacing(16),

    // Position element in window
    position: 'absolute',
    top: theme.spacing(40),

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    )
  },

  // Style when the panel is fully retracted
  panelRetracted: {
    right: -theme.spacing(13)
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: -theme.spacing(8)
  },

  // Style when the panel is hidden
  panelHidden: {
    right: -theme.spacing(18)
  }
}))

/**
 * A small panel with an arrow that expands when hovered to show the user's status.
 * Will transition to the main panel when clicked.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectStatusPanel (props) {
  // Deconstruct props and style class names
  const { hidden, onHide } = props
  const { paperRoot, panelRetracted, panelExpanded, panelHidden } = useStyles()

  // Is the mouse over this component
  const [mouseIsOver, setMouseIsOver] = React.useState(false)

  // Function to run when the component is clicked
  const clickCallback = () => {
    setMouseIsOver(false)
    if (onHide) { onHide() }
  }

  // Return the proper MUI elements
  return (
    <Paper
      elevation={3}
      className={`${paperRoot} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
      onMouseEnter={() => { setMouseIsOver(true) }}
      onMouseLeave={() => { setMouseIsOver(false) }}
      onClick={clickCallback}
    >
      <OpenArrow showDouble={mouseIsOver} flipped />
    </Paper>
  )
}

ConnectStatusPanel.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func
}

ConnectStatusPanel.defaultProps = {
  hidden: false,
  onHide: null
}
