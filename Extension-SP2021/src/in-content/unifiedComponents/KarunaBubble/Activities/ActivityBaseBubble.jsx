import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import { Tooltip as MuiTooltip, Zoom } from '@material-ui/core'

// Create our pre-styled tooltip component
const Tooltip = withStyles((theme) => ({
  arrow: {
    fontSize: theme.spacing(2),
    '&::before': {
      border: '1px solid white'
    },
    color: theme.palette.common.white
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid white',
    color: '#4A4A4A',
    fontSize: theme.typography.body1,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    zIndex: 10
  }
}))(MuiTooltip)

export default function ActivityBaseBubble (props) {
  const { children, baseElement, hidden, offset } = props

  // Customization of the popper for our crazy setup
  const newPopperProps = {
    disablePortal: true,
    modifiers: {
      offset: { offset },
      flip: { enabled: false }
    }
  }

  return (
    <Tooltip
      interactive
      placement='top-end'
      TransitionComponent={Zoom}
      TransitionProps={{ appear: true }}
      open={!hidden && children !== null}
      title={children}
      PopperProps={newPopperProps}
      arrow
    >
      {baseElement}
    </Tooltip>
  )
}

ActivityBaseBubble.propTypes = {
  children: PropTypes.node.isRequired,
  baseElement: PropTypes.node.isRequired,
  offset: PropTypes.string,
  hidden: PropTypes.bool
}

ActivityBaseBubble.defaultProps = {
  hidden: false,
  offset: '-16, -25'
}
