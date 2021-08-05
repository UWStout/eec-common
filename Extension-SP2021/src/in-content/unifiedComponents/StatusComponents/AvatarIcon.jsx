import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Avatar } from '@material-ui/core'
import { BasicUserInfoShape } from '../data/dataTypeShapes'
import { stringToColor } from '../../../util/colorHelper'

const useStyles = makeStyles((theme) => ({
  avatarStyle: (props) => ({
    // AIW A large Avatar size for the user
    width: theme.spacing(props.team ? 4 : 5),
    height: theme.spacing(props.team ? 4 : 5),

    fontSize: (props.team ? '12px' : undefined),
    marginRight: theme.spacing(1),
    marginTop: '4px',

    // Colors as a hash of user id
    color: theme.palette.getContrastText(props.bgColor),
    backgroundColor: props.bgColor
  })
}))

function AvatarIcon (props) {
  // Deconstruct props
  const { userInfo, team } = props

  // Derive color info
  const bgColor = stringToColor(userInfo.id || userInfo._id)

  // Build style rule with props
  const { avatarStyle } = useStyles({ team, bgColor })

  // Build initials
  const initials = userInfo.firstName?.toUpperCase()[0] + userInfo.lastName?.toUpperCase()[0]

  return (
    <Grid item xs={12}>
      <Avatar className={avatarStyle}>{initials}</Avatar>
    </Grid>
  )
}

AvatarIcon.propTypes = {
  userInfo: PropTypes.shape(BasicUserInfoShape).isRequired,
  team: PropTypes.bool
}

AvatarIcon.defaultProps = {
  team: false
}

export default AvatarIcon
