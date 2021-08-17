import React from 'react'
import PropTypes from 'prop-types'

import MuiTooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'

import FeedbackDialogContent from './FeedbackDialogContent.jsx'

// AIW working on styling
// const Tooltip = withStyles((theme) => ({
//   arrow: {
//     '&:before': {
//       border: '1px solid white'
//     },
//     color: theme.palette.common.white
//   },
//   tooltip: {
//     backgroundColor: theme.palette.common.white,
//     border: '1px solid white',
//     color: '#4A4A4A',
//     fontSize: 12
//     maxWidth: 210
//     maxHeight: 180, // the words overflow when this is on
//     overflow: scroll // gets rid of the arrow for some reason?
//   }
// }))(MuiTooltip)

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
    padding: theme.spacing(2)
  }
}))(MuiTooltip)

export default function FeedbackDialog (props) {
  // Deconstruct the props
  const { children, offset, hidden, ...restProps } = props

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
      open={!hidden && children !== null}
      title={<FeedbackDialogContent {...restProps} />}
      PopperProps={newPopperProps}
      arrow
    >
      {children}
    </Tooltip>
  )
}

FeedbackDialog.propTypes = {
  hidden: PropTypes.bool.isRequired,
  children: PropTypes.node,
  offset: PropTypes.string
}

FeedbackDialog.defaultProps = {
  children: null,
  offset: '-16, -25'
}
