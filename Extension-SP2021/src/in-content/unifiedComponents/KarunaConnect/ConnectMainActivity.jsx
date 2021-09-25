/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Suspense } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { DisableInputState } from '../data/globalSate/appState.js'
import { FullUserState, UserTeamsState, UserStatusState } from '../data/globalSate/userState.js'
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
    margin: theme.spacing(0, 0, 2, 0),
    boxShadow: 'none',
    borderTop: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: theme.spacing(0, 0, 2, 0)
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
    margin: theme.spacing(0, 0, 3, 0)
  },
  linkRootLast: {
    underline: 'none',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: 0
  }
}))

export default function ConnectMainActivity (props) {
  const { hidden, retracted } = props
  const { linkRoot, linkRootLast } = useStyles()

  // Retrieve some global state values
  const currentFullUserInfo = useRecoilValue(FullUserState)
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
            <Suspense fallback={<div>...</div>}>
              <StatusListItem userStatus={currentUserStatus} userInfo={currentFullUserInfo} />
            </Suspense>
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
      </Grid>

      {currentTeam &&
        <Grid container item xs={12}>
          <ExternalLink
            href={`https://${HOST_NAME}/TeamCulture.html?teamID=${currentTeam._id}`}
            variant="body1"
            disabled={disableAllInput}
            classes={{ root: (currentTeam.commModelLink ? linkRoot : linkRootLast) }}
          >
            {`${currentTeam.name} Culture`}
          </ExternalLink>
          {currentTeam.commModelLink &&
            <React.Fragment>
              <br />
              <ExternalLink
                href={currentTeam.commModelLink}
                variant="body1"
                disabled={disableAllInput}
                classes={{ root: linkRootLast }}
              >
                {'Team Communication Model'}
              </ExternalLink>
            </React.Fragment>}
        </Grid>}
    </Grid>
  )
}

ConnectMainActivity.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired
}
