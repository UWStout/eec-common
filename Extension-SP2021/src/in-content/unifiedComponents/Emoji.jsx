import React from 'react'
import PropTypes from 'prop-types'

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

function Emoji () {
  return (
    <ListItem>
      <ListItemIcon>
        😒
      </ListItemIcon>
      <ListItemText
        primary="meh"
      />
    </ListItem>
  )
}

Emoji.propTypes = {

}

export default Emoji
