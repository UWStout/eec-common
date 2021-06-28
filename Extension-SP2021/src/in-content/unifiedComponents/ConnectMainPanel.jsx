import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import PanelTitle from './PanelTitle.jsx'
import ConnectMainContent from './ConnectMainContent.jsx'

import { makeLogger } from '../../util/Logger.js'
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
    right: -theme.spacing(2)
  },

  // Style when the panel is hidden
  panelHidden: {
    right: -theme.spacing(35)
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
 * The main Karuna Connect panel showing info about user status, team status,
 * and more with functionality to update status.
 *
 * @param {object} props Properties for the component (See propTypes)
 * @returns {React.Element} The element to render for this component
 */
export default function ConnectMainPanel (props) {
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

  // Return the proper MUI elements
  return (
    <Paper
      data-testid="connectMainPanel"
      elevation={5}
      className={`${paperRoot} ${hidden ? panelHidden : (mouseIsOver ? panelExpanded : panelRetracted)}`}
      onMouseEnter={() => { setMouseIsOver(true); cancelHide() }}
      onMouseLeave={() => { setMouseIsOver(false); hide(false) }}
    >
      <PanelTitle title='Karuna Connect' arrow='right' onClose={() => { hide(true) }} />
      <div className={boxStyle}>
        <main className={contentStyle}>
          <ConnectMainContent {...contentProps} />
        </main>
      </div>
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
