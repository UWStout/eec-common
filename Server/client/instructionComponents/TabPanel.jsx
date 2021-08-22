import React from 'react'
import PropTypes from 'prop-types'

import { Box, Typography } from '@material-ui/core'

export default function TabPanel (props) {
  const { children, name, active, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={!active}
      id={`action-tabpanel-${name}`}
      aria-labelledby={`action-tab-${name}`}
      {...other}
    >
      {active && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  active: PropTypes.bool
}

TabPanel.defaultProps = {
  children: null,
  active: false
}
