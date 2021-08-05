import React from 'react'
import PropTypes from 'prop-types'

import { AffectListState } from '../data/globalState.js'
import { useRecoilValue } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

import AvatarIcon from './AvatarIcon.jsx'
import CustomTooltip from '../KarunaConnect/CustomTooltip.jsx'
import { BasicUserInfoShape, StatusObjectShape } from '../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  gridRoot: (props) => ({
    maxHeight: (props.isTeammate ? theme.spacing(6) : theme.spacing(6)),
    marginBottom: theme.spacing(1)
  })
}))

export default function StatusListItem (props) {
  // Deconstruct the props
  const { userInfo, userStatus, isTeammate } = props
  const { gridRoot } = useStyles(props)

  // Subscribe to the emoji list (for looking up affect objects)
  const emojiList = useRecoilValue(AffectListState)

  // Lookup current affect object from its ID
  const currentAffect = emojiList.find((item) => {
    return item._id === userStatus?.currentAffectID
  })

  const label = (isTeammate ? 'Current Status of Team' : 'Current Status of User')
  return (
    <Grid container direction="column" className={gridRoot} role={'region'} aria-label={label}>
      <AvatarIcon userInfo={userInfo} team={isTeammate} />
      <Grid container item>
        <Grid item>
          <Typography noWrap variant={(isTeammate ? 'caption' : 'body1')}>
            {isTeammate ? userInfo.email : 'My Statuses'}
          </Typography>
        </Grid>
        <Grid container item spacing={1}>
          <Grid item>
            <CustomTooltip placement='right' title={currentAffect ? currentAffect.name : 'unknown'}>
              <Typography variant={(isTeammate ? 'caption' : 'body1')} align='center'>
                {currentAffect ? currentAffect.characterCodes[0] : 'N/A'}
              </Typography>
            </CustomTooltip>
          </Grid>
          <Grid item>
            <CustomTooltip placement='right' title={(userStatus ? (userStatus.collaboration ? 'teamwork' : 'solo') : 'unknown')}>
              <Typography variant={(isTeammate ? 'caption' : 'body1')} align='center'>
                {(userStatus ? (userStatus.collaboration ? '👫' : '🧍') : '?')}
              </Typography>
            </CustomTooltip>
          </Grid>
          <Grid item>
            <CustomTooltip placement='right' title={(userStatus ? (userStatus?.timeToRespond > 0 ? `${userStatus.timeToRespond} mins` : '? mins') : 'N/A')}>
              <Typography variant={(isTeammate ? 'caption' : 'body1')} align='center'>
                🕐
              </Typography>
            </CustomTooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

StatusListItem.propTypes = {
  userInfo: PropTypes.shape(BasicUserInfoShape).isRequired,
  userStatus: PropTypes.shape(StatusObjectShape),
  isTeammate: PropTypes.bool
}

StatusListItem.defaultProps = {
  isTeammate: false,
  userStatus: undefined
}
