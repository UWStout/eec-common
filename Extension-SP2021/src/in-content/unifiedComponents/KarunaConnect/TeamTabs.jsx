import React from 'react'

import { useRecoilState, useRecoilValue } from 'recoil'
import { DisableInputState } from '../data/globalSate/appState.js'
import { UserTeamsState } from '../data/globalSate/userState.js'
import { ActiveTeamIndexState } from '../data/globalSate/teamState.js'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Tabs, Tab, Typography, Box } from '@material-ui/core'

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
    minWidth: theme.spacing(8),
    maxWidth: theme.spacing(15),
    minHeight: theme.spacing(4),
    height: theme.spacing(4)
  }
}))(({ label, ...restProps }) => (
  <Tab
    disableRipple
    label={
      <Box px={1} width="100%">
        <Typography variant="caption" display="block" noWrap>
          {label}
        </Typography>
      </Box>
     }
    {...restProps}
  />)
)

const useStyles = makeStyles((theme) => ({
  scrollButtonRoot: {
    width: '20px'
  }
}))

export default function TeamTabs () {
  const classes = useStyles()

  const userTeams = useRecoilValue(UserTeamsState)
  const [activeTeamIndex, setActiveTeamIndex] = useRecoilState(ActiveTeamIndexState)
  const disableAllInput = useRecoilValue(DisableInputState)

  const teamListIsEmpty = (!Array.isArray(userTeams) || userTeams.length < 1)
  return (
    <MiniTabs
      value={activeTeamIndex}
      indicatorColor="primary"
      textColor="primary"
      variant="scrollable"
      scrollButtons={!teamListIsEmpty && userTeams.length > 1 ? 'auto' : 'off'}
      onChange={(e, newIndex) => { setActiveTeamIndex(newIndex) }}
      id="user-teams-tabs"
      aria-label="User teams"
      TabScrollButtonProps={{
        classes: { root: classes.scrollButtonRoot }
      }}
    >
      {/* Are there any teams to display? */}
      {teamListIsEmpty
        ? <MiniTab label={'(no team)'} disabled={disableAllInput} />

        // Map the list of team names to tabs
        : userTeams.map((team) => (
          <MiniTab key={team._id} label={team.name} {...tabA11yProps(team._id)} disabled={disableAllInput} />
        ))}
    </MiniTabs>
  )
}
