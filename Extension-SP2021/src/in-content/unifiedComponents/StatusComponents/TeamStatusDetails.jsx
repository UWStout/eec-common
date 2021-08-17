import React from 'react'

import { useRecoilValue } from 'recoil'
import { ActiveTeamIDState, TeammatesUserInfoState } from '../data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, List, Grid } from '@material-ui/core'

import StatusListItem from './StatusListItem.jsx'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Team Status Details', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  rootGridStyle: {
    paddingRight: '0px'
  },
  scrollingList: {
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '184px'
  }
}))

export default function TeamStatusDetails (props) {
  // Construct our style class names
  const { rootGridStyle, scrollingList } = useStyles()

  // Subscribe to global state about teams (GLOBAL STATE)
  const activeTeamID = useRecoilValue(ActiveTeamIDState)
  const teammatesInfo = useRecoilValue(TeammatesUserInfoState)

  // Ensure there is an active team
  if (activeTeamID === '') {
    return <Typography variant="body1">{'No active team'}</Typography>
  }

  // Ensure there are teammates to display
  if (!Array.isArray(teammatesInfo) || teammatesInfo.length < 1) {
    return <Typography variant="body1">{'Failed to retrieve teammates for active team'}</Typography>
  }

  // Build array of 'team' statuses
  const teamStatusListItems = []
  for (let i = 0; i < teammatesInfo.length; i++) {
    const teammate = teammatesInfo[i]
    teamStatusListItems.push(
      <StatusListItem key={teammate._id} userInfo={teammate} userStatus={teammate.status} isTeammate />
    )
  }

  return (
    // AIW Adjusting styling
    // <Grid container direction='column' spacing={1} item xs={12} className={rootGridStyle}>
    <Grid container direction='column' item xs={12} className={rootGridStyle}>
      {/* AIW Testing out team name in the header */}
      {/* <Grid item>
        <Typography variant='body1'>
          {teammatesInfo?.length > 0 ? teammatesInfo[0].teamName : 'Unknown Team'}
        </Typography>
      </Grid> */}
      <Grid item className={scrollingList}>
        <List role={'list'} component="div" aria-label={'Status of Teammates'}>
          {teamStatusListItems}
        </List>
      </Grid>
    </Grid>
  )
}
