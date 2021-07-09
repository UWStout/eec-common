import React, { useState, useRef, useEffect } from 'react'
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
    maxWidth: 210
    // maxHeight: 180, // the words overflow when this is on
    // overflow: scroll // gets rid of the arrow for some reason?
  }
}))(MuiTooltip)

export default function FeedbackDialogue (props) {
  const { hidden, children, offset, ...restProps } = props

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
      open={!hidden}
      title={<FeedbackDialogueContent {...restProps} />}
      PopperProps={newPopperProps}
      arrow
    >
      {children}
    </Tooltip>
  )
}

FeedbackDialogue.propTypes = {
  children: PropTypes.node,
  offset: PropTypes.string
}

FeedbackDialogue.defaultProps = {
  children: null,
  offset: '-10, -20'
}
