import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import { Paper as MuiPaper, Slide } from '@material-ui/core'

const Paper = withStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: theme.spacing(7),
    height: `calc(100% - ${theme.spacing(7)}px)`,
    width: theme.spacing(33),
    paddingRight: theme.spacing(2),
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    zIndex: 2
  }
}))(MuiPaper)

export default function ActivityBase (props) {
  const { children, ...restProps } = props

  return (
    <Slide {...restProps}>
      <Paper elevation={0}>
        {children}
      </Paper>
    </Slide>
  )
}

ActivityBase.propTypes = {
  children: PropTypes.node.isRequired
}
