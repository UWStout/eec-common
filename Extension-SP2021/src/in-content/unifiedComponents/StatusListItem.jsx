import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@material-ui/core'

export default function StatusListItem(props) {
  const { userEmail } = props

  return (
    <Typography variant='body1'>{`Status for ${userEmail}`}</Typography>
  )
}

StatusListItem.propTypes = {
  userEmail: PropTypes.string.isRequired
}
