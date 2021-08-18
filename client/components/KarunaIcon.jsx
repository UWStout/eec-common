import React from 'react'

import { Avatar, Icon } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

// These colors are borrowed from the default MUI palette
// https://material-ui.com/customization/palette/
const useStyles = makeStyles((theme) => ({
  avatarStyle: {
    margin: theme.spacing(1),
    backgroundColor: '#81c784',
    width: theme.spacing(9),
    height: theme.spacing(9)
  },
  iconStyle: {
    fontFamily: '"Plaster", cursive',
    fontSize: 'xxx-large',
    textAlign: 'center',
    color: '#115293'
  }
}))

export default function KarunaIcon () {
  const { avatarStyle, iconStyle } = useStyles()

  return (
    <Avatar className={avatarStyle}>
      <Icon className={iconStyle}>{'K'}</Icon>
    </Avatar>
  )
}
