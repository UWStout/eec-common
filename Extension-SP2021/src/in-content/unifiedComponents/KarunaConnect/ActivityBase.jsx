import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import { Paper as MuiPaper, Slide } from '@material-ui/core'

const Paper = withStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'absolute',
    top: theme.spacing(6),
    height: `calc(100% - ${theme.spacing(7)}px)`,
    paddingRight: theme.spacing(2),
    overflow: 'hidden',
    flexDirection: 'column'
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
