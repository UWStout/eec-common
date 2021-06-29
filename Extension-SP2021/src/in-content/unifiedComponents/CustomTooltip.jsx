import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip as MuiTooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const Tooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'black',
    color: 'white',
    boxShadow: theme.shadows[1],
    fontSize: 11
  }
}))(MuiTooltip)

export default function CustomTooltip (props) {
  const { children, offset, ...restProps } = props

  // Customization of the popper for our crazy setup
  const newPopperProps = {
    disablePortal: true,
    modifiers: {
      offset: { offset },
      flip: { enabled: false }
    }
  }

  return (
    <Tooltip PopperProps={newPopperProps} {...restProps}>
      {children}
    </Tooltip>
  )
}

CustomTooltip.propTypes = {
  children: PropTypes.node,
  offset: PropTypes.string
}

CustomTooltip.defaultProps = {
  children: null,
  offset: '-10, -20'
}
