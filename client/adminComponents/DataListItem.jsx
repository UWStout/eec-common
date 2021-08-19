import React from 'react'
import PropTypes from 'prop-types'

import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import { Group as GroupIcon, Delete as DeleteIcon } from '@material-ui/icons'

export default function DataListItem (props) {
  const { dataItem, ...restProps } = props
  return (
    <ListItem {...restProps}>
      <ListItemAvatar>
        <Avatar>
          <GroupIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={dataItem.name}
        secondary={dataItem._id}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

DataListItem.propTypes = {
  dataItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  })
}

DataListItem.defaultProps = {
  dataItem: null
}
