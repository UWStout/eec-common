import React from 'react'

import { useRecoilValue } from 'recoil'
import { DisableInputState } from '../data/globalSate/appState.js'
import { ActiveTeamIDState, TeamAffectTemperature, TeammatesUserInfoState } from '../data/globalSate/teamState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, List, Grid, withStyles } from '@material-ui/core'

import StatusListItem from './StatusListItem.jsx'

import MuiSearchBar from 'material-ui-search-bar'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Team Status Details', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled
  },
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
  const { rootGridStyle, scrollingList, disabledText } = useStyles()

  // Subscribe to global state about teams (GLOBAL STATE)
  const disableAllInput = useRecoilValue(DisableInputState)
  const activeTeamID = useRecoilValue(ActiveTeamIDState)
  const teammatesInfo = useRecoilValue(TeammatesUserInfoState)
  const teamTemperature = useRecoilValue(TeamAffectTemperature)

  // Ensure there is an active team
  if (activeTeamID === '') {
    return (
      <Typography variant="body1" className={disableAllInput ? disabledText : ''}>
        {'No active team'}
      </Typography>
    )
  }

  // Ensure there are teammates to display
  if (!Array.isArray(teammatesInfo) || teammatesInfo.length < 1) {
    return (
      <Typography variant="body1" className={disableAllInput ? disabledText : ''}>
        {'Failed to retrieve teammates for active team'}
      </Typography>
    )
  }

  // Build array of 'team' statuses
  const teamStatusListItems = []
  for (let i = 0; i < teammatesInfo.length; i++) {
    const teammate = teammatesInfo[i]
    teamStatusListItems.push(
      <StatusListItem key={teammate._id} userInfo={teammate} userStatus={teammate.status} isTeammate disabled={disableAllInput} />
    )
  }

  return (
    // AIW Adjusting styling
    // <Grid container direction='column' spacing={1} item xs={12} className={rootGridStyle}>
    <Grid container direction='row' item xs={12} className={rootGridStyle} wrap="wrap" spacing={2}>
      {/* For searching through the possible moods */}
      <Grid item xs={12}>
        <Typography variant="body1" className={disableAllInput ? disabledText : ''}>
          {typeof teamTemperature === 'number'
            ? `Team Temperature is ${teamTemperature.toFixed(2)}`
            : 'No team temperature'}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <SearchBar
          role={'search'}
          // value={searchText}
          // onClick={() => { setExpanded('all') }}
          // onChange={onSearchTextChanged}
          placeholder={'search team members'}
          disabled={disableAllInput}
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
