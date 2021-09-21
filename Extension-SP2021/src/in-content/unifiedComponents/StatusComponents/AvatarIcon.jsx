import React from 'react'
import PropTypes from 'prop-types'

import { MessagingContextState } from '../data/globalSate/appState.js'
import { useRecoilValue } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Avatar } from '@material-ui/core'
import { ExtendedUserInfoShape } from '../data/dataTypeShapes'
import { stringToColor } from '../../../util/colorHelper'

const useStyles = makeStyles((theme) => ({
  avatarStyle: (props) => ({
    // AIW A large Avatar size for the user
    width: theme.spacing(props.team ? 4.5 : 6),
    height: theme.spacing(props.team ? 4.5 : 6),

    fontSize: (props.team ? '12px' : undefined),
    marginRight: theme.spacing(1),
    marginTop: (props.team ? '6px' : '4px'),

    // Colors as a hash of user id
    color: theme.palette.getContrastText(props.bgColor),
    backgroundColor: props.bgColor,

    // Opacity if disabled
    opacity: (props.disabled ? 0.5 : 1.0)
  })
}))

function AvatarIcon (props) {
  // Deconstruct props
  const { userInfo, team, disabled } = props

  // Subscribe to changes in messaging context
  const messagingContext = useRecoilValue(MessagingContextState)

  // Derive color info
  const bgColor = stringToColor(userInfo.id || userInfo._id)

  // Build style rule with props
  const { avatarStyle } = useStyles({ team, bgColor, disabled })

  // Build initials
  const names = userInfo.name.split(' ')
  const lastIdx = (names.length > 1 ? names.length - 1 : -1)
  const initials = (names[0] ? names[0].toUpperCase()[0] : '') + (names[lastIdx] ? names[lastIdx].toUpperCase()[0] : '')

  // Get avatar URL (might be undefined)
  const imgURL = userInfo?.contextAlias?.avatar?.[messagingContext]

  return (
    <Grid item xs={12}>
      <Avatar className={avatarStyle} src={imgURL}>{imgURL ? '' : initials}</Avatar>
    </Grid>
  )
}

AvatarIcon.propTypes = {
  userInfo: PropTypes.shape(ExtendedUserInfoShape).isRequired,
  team: PropTypes.bool,
  disabled: PropTypes.bool
}

AvatarIcon.defaultProps = {
  team: false,
  disabled: false
}

export default AvatarIcon
