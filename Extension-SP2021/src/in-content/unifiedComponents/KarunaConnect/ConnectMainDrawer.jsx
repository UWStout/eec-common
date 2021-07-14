import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import PanelTitle from './PanelTitle.jsx'
import ConnectMainContent from './ConnectMainContent.jsx'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('CONNECT Main Panel', 'lime', 'black')

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  paperRoot: {
    // Margins and sizing
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
    width: theme.spacing(39),

    // TODO: Think critically about minHeight, make fit minimal plus some buffer
    // minHeight: theme.spacing(50),
    maxHeight: `calc(80vh - ${theme.spacing(8)}px)`,

    // Position element in window
    position: 'absolute',
    top: '20vh',

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
    right: -theme.spacing(1)
  },

  // Style when the panel is hidden
  panelHidden: {
    right: -theme.spacing(50)
  },

  // Styling for the outer box
  boxStyle: {
    paddingTop: theme.spacing(5),
    marginLeft: '-3px',
    marginRight: '-10px'
  },

  // Styling for the primary content box
  contentStyle: {
    overflowY: 'auto',
    overflowX: 'hidden'
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
  const { hidden, onHide, waitToHide, ...contentProps } = props

  // Deconstruct props and style class names
  const {
    paperRoot,
    panelHidden,
    panelRetracted,
    panelExpanded,
    contentStyle,
    boxStyle
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
      data-testid="connectMainPanel"
      elevation={5}
      className={`${paperRoot} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : (isRetracted ? panelRetracted : panelExpanded))}`}
      onMouseEnter={() => { setMouseIsOver(true); cancelHide(); cancelRetract() }}
      onMouseLeave={() => { setMouseIsOver(false); hide(false); retract(false) }}
    >
      <PanelTitle title='Karuna Connect' arrow='right' onClose={() => { hide(true) }} />
      <div className={boxStyle}>
        <main className={contentStyle}>
          <ConnectMainContent hidden={hidden} retracted={!mouseIsOver} {...contentProps} />
        </main>
      </div>
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
