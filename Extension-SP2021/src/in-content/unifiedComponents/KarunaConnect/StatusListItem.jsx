import React from 'react'
import PropTypes from 'prop-types'

import { UserStatusState, AffectListState } from '../data/globalState.js'
import { useRecoilValue } from 'recoil'

import { Typography, Grid, Avatar } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import CustomTooltip from './CustomTooltip.jsx'

const useStyles = makeStyles((theme) => ({
  userAvatarStyle: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },

  teamAvatarStyle: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  }

}))

export default function StatusListItem (props) {
  const { userEmail, isUserStatus } = props

  const { userAvatarStyle, teamAvatarStyle } = useStyles()

  // Subscribe to changes in current status (GLOBAL STATE)
  const currentStatus = useRecoilValue(UserStatusState)
  const emojiList = useRecoilValue(AffectListState)

  // Lookup current affect object from its ID
  const currentAffect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  return (
    <Grid
      role={'region'}
      aria-label={isUserStatus ? 'Current Status of User' : 'Current Status of Team'}
      container
      wrap='nowrap'
      spacing={1}
    >
      <Grid item className={userAvatarStyle}>
        <Avatar>U</Avatar>
      </Grid>
      <Grid container item direction="column">
        <Grid item>
          <Typography noWrap variant='body1'>{userEmail === '' ? 'My Statuses' : userEmail}</Typography>
        </Grid>
        <Grid container item spacing={1}>
          <Grid item>
            <CustomTooltip placement='right' title={currentAffect ? currentAffect.name : 'none'}>
              <Typography variant='body1' align='center'>{currentAffect ? currentAffect.characterCodes[0] : '?'}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid item>
            <CustomTooltip placement='right' title={currentStatus ? (currentStatus.collaboration ? 'teamwork' : 'solo') : 'unknown'}>
              <Typography variant='body1' align='center'>{currentStatus ? (currentStatus.collaboration ? '👫' : '🧍') : '?'}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid item>
            <CustomTooltip placement='right' title={currentStatus?.timeToRespond > 0 ? `${currentStatus.timeToRespond} mins` : '? mins'}>
              <Typography variant='body1' align='center'>🕐</Typography>
            </CustomTooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

StatusListItem.propTypes = {
  userEmail: PropTypes.string,
  isUserStatus: PropTypes.bool
}

StatusListItem.defaultProps = {
  userEmail: 'berriers@uwstout.edu',
  isUserStatus: false
}
