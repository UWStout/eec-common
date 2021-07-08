import React from 'react'
import PropTypes from 'prop-types'

import { Tooltip as MuiTooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import FeedbackDialogueContent from './FeedbackDialogueContent.jsx'

const Tooltip = withStyles((theme) => ({
  arrow: {
    '&:before': {
      border: '1px solid white'
    },
    color: theme.palette.common.white
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid white',
    color: '#4A4A4A',
    fontSize: 12,
    width: 210
  }
}))(MuiTooltip)

export default function FeedbackDialogue (props) {
  const { openFeedbackDialogue, children, offset, ...restProps } = props

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
      placement='top-end'
      open
      title={<FeedbackDialogueContent />}
      PopperProps={newPopperProps}
      arrow
    >
      {children}
    </Tooltip>
  )
}

FeedbackDialogue.propTypes = {
  openFeedbackDialogue: PropTypes.func.isRequired,
  children: PropTypes.node,
  offset: PropTypes.string
}

FeedbackDialogue.defaultProps = {
  children: null,
  offset: '-10, -20'
}
