import React from 'react'
import PropTypes from 'prop-types'

import { FavoriteAffectsListStateSetter, ToggleFavoriteDeleteState } from '../data/globalSate/userState.js'
import { useSetRecoilState } from 'recoil'

import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { Favorite } from '@material-ui/icons'

import { AffectObjectShape } from '../data/dataTypeShapes.js'

export default function Emoji (props) {
  const { favoriteList, affect, handleClick, ...restProps } = props
  const setFavorite = useSetRecoilState(FavoriteAffectsListStateSetter)
  const toggleRemoveFavorite = useSetRecoilState(ToggleFavoriteDeleteState)

  const isFavorite = favoriteList?.some((favorites) => (favorites === affect._id))

  const handleFavorite = () => {
    if (!isFavorite) setFavorite(affect._id)
    else {
      toggleRemoveFavorite(true)
      setFavorite(affect._id)
      toggleRemoveFavorite(false)
    }
  }

  return (
    <ListItem onClick={(event) => { if (handleClick) { handleClick(affect) } }} {...restProps}>
      <ListItemIcon>{affect.characterCodes[0]}</ListItemIcon>
      <ListItemText primary={affect.name} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="favorite" onClick={handleFavorite}>
          <Favorite color={isFavorite ? 'primary' : 'disabled'} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

Emoji.propTypes = {
  affect: PropTypes.shape(AffectObjectShape).isRequired,
  handleClick: PropTypes.func,
  favoriteList: PropTypes.arrayOf(PropTypes.string)
}

Emoji.defaultProps = {
  handleClick: null,
  favoriteList: []
}
