/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Suspense } from 'react'
import PropTypes from 'prop-types'

import { LoggedInUserState } from '../data/globalSate/appState.js'
import { UserStatusState } from '../data/globalSate/userState.js'
import { ActiveTeamIDState, TeammatesUserInfoState } from '../data/globalSate/teamState.js'

import { withStyles } from '@material-ui/core/styles'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

import MuiLink from '@material-ui/core/Link'

import { Grid, Typography } from '@material-ui/core'
import { ExpandMore, Settings as SettingsIcon } from '@material-ui/icons'

import StatusListItem from '../StatusComponents/StatusListItem.jsx'
import UserStatusDetails from '../StatusComponents/UserStatusDetails.jsx'
import ListNVCElements from '../NVCInfoSections/ListNVCElements.jsx'
import { useRecoilValue } from 'recoil'
import TeamStatusDetails from '../StatusComponents/TeamStatusDetails.jsx'

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
    }
  },
  expanded: {}
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

const Link = withStyles((theme) => ({
  root: {
    underline: 'none',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: theme.spacing(0, 0, 3, 0),
    '&:last-of-type': {
      margin: 0
    }
  }
}))(MuiLink)

export default function ConnectMainActivity (props) {
  const { hidden, retracted } = props

  const currentUserInfo = useRecoilValue(LoggedInUserState)
  const currentUserStatus = useRecoilValue(UserStatusState)

  // Subscribe to global state about teams (GLOBAL STATE)
  const activeTeamID = useRecoilValue(ActiveTeamIDState)
  const teammatesInfo = useRecoilValue(TeammatesUserInfoState)

  const [expanded, setExpanded] = useState('')
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  // AIW Testing conversion of team culture and NVC to external links
  const preventDefault = (event) => event.preventDefault()

  // Ensure there is an active team
  if (activeTeamID === '') {
    return <Typography variant="body1">{'No active team'}</Typography>
  }

  return (
    <Grid container item xs={12} role={'region'} aria-label={'Main Content'}>
      <Grid container item xs={12}>
        {/* user status list item */}
        <Accordion square expanded={expanded === 'userStatus'} aria-controls={'karunaStatusDrawer'} onChange={handleChange('userStatus')}>
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
        <Accordion square expanded={expanded === 'teamStatus'} onChange={handleChange('teamStatus')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label={'Team Status'}
            aria-controls="team-status-content"
            id="team-status-header"
          >
            <Typography>
              {teammatesInfo?.length > 0 ? teammatesInfo[0].teamName : 'Unknown Team'} Status
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Suspense fallback={<div />}>
              <TeamStatusDetails />
            </Suspense>
          </AccordionDetails>
        </Accordion>

        {/* AIW Testing conversion of team culture and NVC to external links */}
        {/* Team Culture list item */}
        {/* <Accordion square expanded={expanded === 'teamCulture'} onChange={handleChange('teamCulture')}>
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
        <Link
          // AIW The target destination is intended to be whatever the Team's culture document is.
          href="#" onClick={preventDefault}
          aria-label={'Team Culture'}
          aria-controls="team-culture-content"
          id="team-culture-header"
        >
          <Typography>
            {teammatesInfo?.length > 0 ? teammatesInfo[0].teamName : 'Unknown Team'} Culture
          </Typography>
        </Link>

        <Link
          // AIW The target destination is intended to be whatever the Team's comunication model is.
          href="#" onClick={preventDefault}
          aria-label={'NVC Information'}
          aria-controls="nvc-info-content"
          id="nvc-info-header"
        >
          <Typography>NVC</Typography>
        </Link>
      </Grid>
    </Grid>
  )
}

ConnectMainActivity.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired
}
