/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect, Suspense } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { DisableInputState } from '../data/globalSate/appState.js'
import { LoggedInUserState, UserTeamsState, UserStatusState } from '../data/globalSate/userState.js'
import { ActiveTeamIndexState } from '../data/globalSate/teamState.js'

import { withStyles, makeStyles } from '@material-ui/core/styles'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

import { Grid, Typography } from '@material-ui/core'
import { ExpandMore, Settings as SettingsIcon } from '@material-ui/icons'

import StatusListItem from '../StatusComponents/StatusListItem.jsx'
import UserStatusDetails from '../StatusComponents/UserStatusDetails.jsx'
import TeamStatusDetails from '../StatusComponents/TeamStatusDetails.jsx'
import ExternalLink from '../Shared/ExternalLink.jsx'

import { HOST_NAME } from '../../../util/serverConfig.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Main Content', 'lightblue', 'black')

const Accordion = withStyles((theme) => ({
  root: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: theme.spacing(0, 0, 3, 0),
    boxShadow: 'none',
    borderTop: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: theme.spacing(0, 0, 3, 0)
    },
    '&$disabled': {
      backgroundColor: theme.palette.background.paper
    }
  },
  expanded: {},
  disabled: {}
}))(MuiAccordion)

const AccordionSummary = withStyles((theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: 0
  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0
    }
  },
  expanded: {}
}))(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: 0,
    borderBottom: '1px solid rgba(0, 0, 0, .125)'
  }
}))(MuiAccordionDetails)

const useStyles = makeStyles((theme) => ({
  linkRoot: {
    underline: 'none',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: theme.spacing(0, 0, 3, 0),
    '&:last-of-type': {
      margin: 0
    }
  }
}))

export default function ConnectMainActivity (props) {
  const { hidden, retracted } = props
  const { linkRoot } = useStyles()

  // Retrieve some global state values
  const currentUserInfo = useRecoilValue(LoggedInUserState)
  const currentUserStatus = useRecoilValue(UserStatusState)
  const disableAllInput = useRecoilValue(DisableInputState)

  // Subscribe to global state about teams (GLOBAL STATE)
  const activeTeam = useRecoilValue(ActiveTeamIndexState)
  const teams = useRecoilValue(UserTeamsState)

  // Local state about which accordion panel is expanded
  const [expanded, setExpanded] = useState('')
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '')
  }

  // Get ref to current team
  let currentTeam = null
  if (Array.isArray(teams) && activeTeam >= 0 && activeTeam < teams.length) {
    currentTeam = teams[activeTeam]
  }

  return (
    <Grid container item xs={12} role={'region'} aria-label={'Main Content'} id="main-activity-content">
      <Grid container item xs={12}>
        {/* user status list item */}
        <Accordion square expanded={expanded === 'userStatus'} aria-controls={'karunaStatusDrawer'} onChange={handleChange('userStatus')} disabled={disableAllInput}>
          <AccordionSummary
            expandIcon={<SettingsIcon />}
            aria-label={'Current User Status'}
            aria-controls="user-status-content"
            id="user-status-header"
          >
            <StatusListItem userStatus={currentUserStatus} userInfo={currentUserInfo} />
          </AccordionSummary>
          <AccordionDetails>
            <Suspense fallback={<div />}>
              <UserStatusDetails hidden={hidden} retracted={retracted} />
            </Suspense>
          </AccordionDetails>
        </Accordion>

        {/* Team Status list item */}
        {currentTeam &&
          <Accordion square expanded={expanded === 'teamStatus'} onChange={handleChange('teamStatus')} disabled={disableAllInput}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-label={'Team Status'}
              aria-controls="team-status-content"
              id="team-status-header"
            >
              <Typography>
                {`${currentTeam.name} Status`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Suspense fallback={<div />}>
                <TeamStatusDetails />
              </Suspense>
            </AccordionDetails>
          </Accordion>}

        {/* AIW Testing conversion of team culture and NVC to external links */}
        {/* Team Culture list item */}
        {/* <Accordion square expanded={expanded === 'teamCulture'} onChange={handleChange('teamCulture')} disabled={disableAllInput}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label={'Team Culture'}
            aria-controls="team-culture-content"
            id="team-culture-header"
          > */}
        {/* <Typography>Team Culture</Typography> */}
        {/* AIW Testing out team name in the header */}
        {/* <Typography>
            {teammatesInfo?.length > 0 ? teammatesInfo[0].teamName : 'Unknown Team'} Culture
          </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant={'body2'}>WIP</Typography>
          </AccordionDetails>
        </Accordion> */}

        {/* NVC Information list item */}
        {/* <Accordion square expanded={expanded === 'nvcInfo'} onChange={handleChange('nvcInfo')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label={'NVC Information'}
            aria-controls="nvc-info-content"
            id="nvc-info-header"
          >
            <Typography>NVC</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ListNVCElements />
          </AccordionDetails>
        </Accordion> */}
      </Grid>

      <Grid container item xs={12}>
        {currentTeam &&
          <ExternalLink href={`https://${HOST_NAME}/TeamCulture.html?teamID=${currentTeam._id}`} variant="body1" aria-label={'Team Culture'} disabled={disableAllInput} classes={{ root: linkRoot }}>
            {`${currentTeam.name} Culture`}
          </ExternalLink>}
        {currentTeam && <br />}

        <ExternalLink href="#nvc-info" variant="body1" aria-label={'NVC Information'} disabled={disableAllInput} classes={{ root: linkRoot }}>
          {'NVC'}
        </ExternalLink>
      </Grid>
    </Grid>
  )
}

ConnectMainActivity.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired
}
