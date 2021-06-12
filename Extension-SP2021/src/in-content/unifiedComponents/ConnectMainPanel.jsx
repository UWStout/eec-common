import React from 'react'
import PropTypes from 'prop-types'

import { Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  paperRoot: {
    // Margins and sizing
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
    width: theme.spacing(25),
    height: theme.spacing(60),

    // Position element in window
    position: 'absolute',
    top: theme.spacing(40),

    // Animate changes in the 'right' property
    transition: theme.transitions.create(
      ['right'], { duration: theme.transitions.duration.standard }
    )
  },

  // Style when the panel is retracted
  panelRetracted: {
    right: -theme.spacing(16)
  },

  // Style when the panel is fully expanded
  panelExpanded: {
    right: -theme.spacing(2)
  },

  // Style when the panel is hidden
  panelHidden: {
    right: -theme.spacing(35)
  }
}))

/**
 * The main Karuna Connect panel showing info about user status, team status,
 * and more with functionality to update status.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectMainPanel (props) {
  // Deconstruct props and style class names
  const { hidden, onHide, waitToHide } = props
  const { paperRoot, panelHidden, panelRetracted, panelExpanded } = useStyles()

  // Hover state of mouse
  const [mouseIsOver, setMouseIsOver] = React.useState(false)

  // Handle to the pending hide request (if any)
  const [hideTimeout, setHideTimeout] = React.useState(false)

  // Function for queueing a hide request
  const hide = () => {
    if (onHide) {
      const timeoutHandle = setTimeout(() => { onHide() }, waitToHide)
      setHideTimeout(timeoutHandle)
    }
  }

  // Function for canceling a pending hide request
  const cancelHide = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(false)
    }
  }

  // Return the proper MUI elements
  return (
    <Paper
      elevation={5}
      className={`${paperRoot} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
      onMouseEnter={() => { setMouseIsOver(true); cancelHide() }}
      onMouseLeave={() => { setMouseIsOver(false); hide() }}
    >
      <Typography variant='body1'>
        {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
      </Typography>
    </Paper>
  )
}

ConnectMainPanel.propTypes = {
  /** Is the panel hidden */
  hidden: PropTypes.bool,

  /** Callback function when the panel should be hidden */
  onHide: PropTypes.func,

  /** Milliseconds to wait before hiding the panel */
  waitToHide: PropTypes.number
}

ConnectMainPanel.defaultProps = {
  hidden: false,
  onHide: null,
  waitToHide: 3000
}
