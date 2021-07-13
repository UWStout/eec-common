import React from 'react'
import PropTypes from 'prop-types'

import { UserStatusState } from '../data/globalState.js'
import { useRecoilValue } from 'recoil'

import { Typography, Grid, Avatar } from '@material-ui/core'

import CustomTooltip from './CustomTooltip.jsx'

import { AffectObjectShape } from '../data/dataTypeShapes.js'

export default function StatusListItem (props) {
  const { userEmail, affect } = props

  // Subscribe to changes in current status (GLOBAL STATE)
  const currentStatus = useRecoilValue(UserStatusState)

  return (
    <Grid container>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Avatar>U</Avatar>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography noWrap variant='body1'>{userEmail === '' ? 'My Statuses' : userEmail}</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item>
                    <CustomTooltip placement='right' title={affect ? affect.name : 'none'}>
                      <Typography variant='body1'>{affect ? affect.characterCodes[0] : '?'}</Typography>
                    </CustomTooltip>
                  </Grid>
                  <Grid item>
                    <CustomTooltip placement='right' title={currentStatus ? (currentStatus.collaboration ? 'teamwork' : 'solo') : 'unknown'}>
                      <Typography variant='body1'>{currentStatus ? (currentStatus.collaboration ? '👫' : '🧍') : '?'}</Typography>
                    </CustomTooltip>
                  </Grid>
                  <Grid item>
                    <CustomTooltip placement='right' title={currentStatus?.timeToRespond > 0 ? `${currentStatus.timeToRespond} mins` : '? mins'}>
                      <Typography variant='body1'>🕐</Typography>
                    </CustomTooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

StatusListItem.propTypes = {
  affect: PropTypes.shape(AffectObjectShape).isRequired,
  userEmail: PropTypes.string
}

StatusListItem.defaultProps = {
  userEmail: ''
}
