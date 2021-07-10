import React from 'react'
import PropTypes from 'prop-types'

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { AffectObjectShape } from '../data/dataTypeShapes.js'

export default function Emoji (props) {
  const { affect, handleClick, ...restProps } = props
  return (
    <ListItem onClick={(event) => { if (handleClick) { handleClick(affect) } }} {...restProps}>
      <ListItemIcon>{affect.characterCodes[0]}</ListItemIcon>
      <ListItemText primary={affect.name} />
    </ListItem>
  )
}

Emoji.propTypes = {
  affect: PropTypes.shape(AffectObjectShape).isRequired,
  handleClick: PropTypes.func
}

Emoji.defaultProps = {
  handleClick: null
}
