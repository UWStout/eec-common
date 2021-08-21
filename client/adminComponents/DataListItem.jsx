import React from 'react'
import PropTypes from 'prop-types'

import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Tooltip } from '@material-ui/core'
import { Group as GroupIcon, Person as PersonIcon, Domain as DomainIcon, ThumbUpAlt as ThumbUpIcon, Delete as DeleteIcon } from '@material-ui/icons'

export default function DataListItem (props) {
  const { dataItem, dataType, onAction, onDelete, isAdmin, ...restProps } = props
  return (
    <ListItem {...restProps}>
      <ListItemAvatar>
        <Avatar>
          {dataType === 'user' && <PersonIcon />}
          {dataType === 'team' && <GroupIcon />}
          {dataType === 'unit' && <DomainIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={dataType === 'user' ? `${dataItem.name} (${dataItem.preferredName})` : dataItem.name}
        secondary={dataType === 'user' ? dataItem.email : dataItem._id}
      />
      <ListItemSecondaryAction>
        {dataType === 'user' && !isAdmin &&
          <Tooltip title="Promote User" placement="left">
            <IconButton aria-label="promote" onClick={onAction}>
              <ThumbUpIcon />
            </IconButton>
          </Tooltip>}
        <Tooltip title="Delete" placement="right">
          <IconButton edge="end" aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

DataListItem.propTypes = {
  dataItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    preferredName: PropTypes.string,
    email: PropTypes.string
  }),
  onAction: PropTypes.func,
  onDelete: PropTypes.func,
  dataType: PropTypes.string,
  isAdmin: PropTypes.bool
}

DataListItem.defaultProps = {
  dataItem: null,
  dataType: 'user',
  onAction: null,
  onDelete: null,
  isAdmin: false
}
