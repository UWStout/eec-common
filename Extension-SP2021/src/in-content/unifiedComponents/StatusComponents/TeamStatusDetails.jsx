import React, { useEffect } from 'react'

import { useRecoilValue } from 'recoil'
import { ActiveTeamIDState, TeamAffectTemperature, TeammatesUserInfoState, UserAffectIDState } from '../data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, List, Grid, withStyles } from '@material-ui/core'

import StatusListItem from './StatusListItem.jsx'

import MuiSearchBar from 'material-ui-search-bar'

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

const SearchBar = withStyles((theme) => ({
  root: {
    // paddingBottom: theme.spacing(2)
  }
}))(MuiSearchBar)

export default function TeamStatusDetails (props) {
  // Construct our style class names
  const { rootGridStyle, scrollingList } = useStyles()

  // Subscribe to global state about teams (GLOBAL STATE)
  const activeTeamID = useRecoilValue(ActiveTeamIDState)
  const teammatesInfo = useRecoilValue(TeammatesUserInfoState)
  const teamTemperature = useRecoilValue(TeamAffectTemperature)
  // const currentAffect = useRecoilValue(UserAffectIDState)


  // useEffect(() => {
  //   teamTemperature = useRecoilValue(TeamAffectTemperature)
  // }, [currentAffect])

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
    <Grid container direction='row' item xs={12} className={rootGridStyle} wrap="wrap" spacing={2}>
      {/* AIW Testing out team name in the header */}
      {/* <Grid item>
        <Typography variant='body1'>
          {teammatesInfo?.length > 0 ? teammatesInfo[0].teamName : 'Unknown Team'}
        </Typography>
      </Grid> */}
      {/* For searching through the possible moods */}
      <Grid item xs={12}>
        Team Temperature is {teamTemperature}
      </Grid>
      <Grid item xs={12}>
        <SearchBar
          role={'search'}
          // value={searchText}
          // onClick={() => { setExpanded('all') }}
          // onChange={onSearchTextChanged}
          placeholder={'search team members'}
          // disabled={noInteraction}
          aria-label={'Team Member Search Box'}
        />
      </Grid>
      <Grid item xs={12} className={scrollingList}>
        <List role={'list'} component="div" aria-label={'Status of Teammates'}>
          {teamStatusListItems}
        </List>
      </Grid>
    </Grid>
  )
}
