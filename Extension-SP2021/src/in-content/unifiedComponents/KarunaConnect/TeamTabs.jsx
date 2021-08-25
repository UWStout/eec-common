import React from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { UserTeamsState } from '../data/globalSate/userState.js'
import { ActiveTeamIndexState } from '../data/globalSate/teamState.js'

import { withStyles } from '@material-ui/core/styles'
import { Tabs, Tab, Typography } from '@material-ui/core'

function tabA11yProps (id) {
  return {
    id: `user-team-tab-${id}`,
    'aria-controls': 'main-activity-content'
  }
}

const MiniTabs = withStyles((theme) => ({
  root: {
    borderBottom: '1px solid #e8e8e8',
    minHeight: theme.spacing(4),
    height: theme.spacing(4)
  },
  indicator: {
    backgroundColor: '#1890ff'
  }
}))(Tabs)

const MiniTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: theme.spacing(5),
    minHeight: theme.spacing(4),
    height: theme.spacing(4),
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:focus': {
      color: '#40a9ff'
    }
  },
  selected: {}
}))(({ label, ...restProps }) => (
  <Tab
    disableRipple
    label={
      <Typography variant="caption">
        {label}
      </Typography>
    }
    {...restProps}
  />)
)

export default function TeamTabs () {
  const userTeams = useRecoilValue(UserTeamsState)
  const [activeTeamIndex, setActiveTeamIndex] = useRecoilState(ActiveTeamIndexState)

  return (
    <MiniTabs
      value={activeTeamIndex}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons="auto"
      onChange={(e, newIndex) => { setActiveTeamIndex(newIndex) }}
      id="user-teams-tabs"
      aria-label="User teams"
    >
      {(!Array.isArray(userTeams) || userTeams.length < 1) ?
        <MiniTab label={'(no team)'} /> :
        userTeams.map((team) => (
          <MiniTab key={team._id} label={team.name} {...tabA11yProps(team._id)} />
        ))}
    </MiniTabs>
  )
}
