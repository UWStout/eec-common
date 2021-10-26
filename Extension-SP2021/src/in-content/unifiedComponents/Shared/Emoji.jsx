import React from 'react'
import PropTypes from 'prop-types'

import { FavoriteAffectsListStateSetter, ToggleFavoriteDeleteState } from '../data/globalSate/userState.js'
import { useSetRecoilState } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Avatar } from '@material-ui/core'
import { Favorite as FavoriteIcon } from '@material-ui/icons'

import { AffectObjectShape } from '../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  avatarStyle: {
    backgroundColor: '#ffffff00'
  },
  textStyle: {
    overflowX: 'hidden',
    maxWidth: '60%'
  },
  favButtonStyle: {
    color: (props) => (props.isFavorite ? theme.palette.primary.light : theme.palette.grey[300]),
    padding: theme.spacing(0.5),
    '&:hover': {
      color: (props) => (props.isFavorite ? theme.palette.primary.dark : theme.palette.grey[500]),
      backgroundColor: '#ffffff00'
    }
  }
}))

export default function Emoji (props) {
  const { favoriteList, affect, handleClick, ...restProps } = props

  const setFavorite = useSetRecoilState(FavoriteAffectsListStateSetter)
  const toggleRemoveFavorite = useSetRecoilState(ToggleFavoriteDeleteState)

  const isFavorite = favoriteList?.some((favorites) => (favorites === affect._id))
  const { avatarStyle, textStyle, favButtonStyle } = useStyles({ isFavorite })

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
      <ListItemAvatar>
        <Avatar className={avatarStyle}>{affect.characterCodes[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={affect.name} className={textStyle} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="favorite" disableFocusRipple disableRipple className={favButtonStyle} onClick={handleFavorite}>
          <FavoriteIcon />
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
