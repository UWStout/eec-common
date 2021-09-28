import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { AffectListState } from '../data/globalSate/teamState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'

import AvatarIcon from './AvatarIcon.jsx'
import CustomTooltip from '../KarunaConnect/CustomTooltip.jsx'
import CollaborationIcon from '../Shared/CollaborationIcon.jsx'
import TimeToRespondIcon from '../Shared/TimeToRespondIcon.jsx'

import { ExtendedUserInfoShape, StatusObjectShape } from '../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  gridRoot: (props) => ({
    maxHeight: (props.isTeammate ? theme.spacing(6) : theme.spacing(6)),
    marginBottom: theme.spacing(props.spacingBottom)
  }),
  nameStyle: (props) => ({
    fontSize: (props.isTeammate ? '10px' : '12px')
  }),
  pronounStyle: (props) => ({
    fontSize: (props.isTeammate ? '8px' : '10px'),
    fontStyle: 'italic'
  }),
  nameStyleDisabled: (props) => ({
    fontSize: (props.isTeammate ? '10px' : '12px'),
    color: theme.palette.text.disabled
  }),
  pronounStyleDisabled: (props) => ({
    fontSize: (props.isTeammate ? '8px' : '10px'),
    fontStyle: 'italic',
    color: theme.palette.text.disabled
  }),
  disabledText: {
    color: theme.palette.text.disabled
  }
}))

export default function StatusListItem (props) {
  // Deconstruct the props
  const { userInfo, userStatus, showName, isTeammate, disabled } = props
  const { gridRoot, nameStyle, pronounStyle, nameStyleDisabled, pronounStyleDisabled, disabledText } = useStyles(props)

  // Subscribe to the emoji list (for looking up affect objects)
  const emojiList = useRecoilValue(AffectListState)

  // Lookup current affect object from its ID
  const currentAffect = emojiList.find((item) => {
    return item._id === userStatus?.currentAffectID
  })

  const label = (isTeammate ? 'Current Status of Teammate' : 'Current Status of User')
  return (
    <Grid container direction="column" className={gridRoot} role={'region'} aria-label={label}>
      <AvatarIcon userInfo={userInfo} team={isTeammate} disabled={disabled} />
      <Grid container item>
        <Grid item xs={12}>
          <Typography noWrap variant={'body1'} className={disabled ? nameStyleDisabled : nameStyle}>
            {isTeammate || showName ? userInfo.preferredName : 'My Statuses'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography noWrap variant={'body1'} className={disabled ? pronounStyleDisabled : pronounStyle}>
            {userInfo.preferredPronouns ? userInfo.preferredPronouns : '(not provided)'}
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item>
            <CustomTooltip placement='right' title={currentAffect ? currentAffect.name : 'unknown'}>
              <Typography variant={(isTeammate ? 'caption' : 'body1')} align='center' className={disabled ? disabledText : ''}>
                {currentAffect ? currentAffect.characterCodes[0] : 'N/A'}
              </Typography>
            </CustomTooltip>
          </Grid>
          <Grid item>
            <CollaborationIcon
              collaboration={userStatus?.collaboration}
              fontSize={(isTeammate ? 'small' : 'medium')}
              placement='right'
              disabled={disabled}
            />
          </Grid>
          <Grid item>
            <TimeToRespondIcon
              timeToRespond={userStatus?.timeToRespond}
              fontSize={(isTeammate ? 'small' : 'medium')}
              placement='right'
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

StatusListItem.propTypes = {
  userInfo: PropTypes.shape(ExtendedUserInfoShape).isRequired,
  userStatus: PropTypes.shape(StatusObjectShape),
  // eslint-disable-next-line react/no-unused-prop-types
  spacingBottom: PropTypes.number,
  showName: PropTypes.bool,
  isTeammate: PropTypes.bool,
  disabled: PropTypes.bool
}

StatusListItem.defaultProps = {
  spacingBottom: 1,
  showName: false,
  isTeammate: false,
  userStatus: undefined,
  disabled: false
}
