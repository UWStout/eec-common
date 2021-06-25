import React from 'react'
import PropTypes from 'prop-types'

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

export default function Emoji ({ characterCode, name, description }) {
  return (
    <ListItem>
      <ListItemIcon>
        {characterCode[0]}
      </ListItemIcon>
      <ListItemText
        primary={name}
      />
    </ListItem>
  )
}

Emoji.propTypes = {
  characterCode: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string,
  description: PropTypes.string
}

Emoji.defaultProps = {
  name: '',
  description: ''
}
