/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, Suspense } from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

import { Grid, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import StatusListItem from './StatusListItem.jsx'
import UserStatusDetails from './UserStatusDetails.jsx'
import ListNVCElements from '../NVCInfoSections/ListNVCElements.jsx'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Main Content', 'lightblue', 'black')

const Accordion = withStyles((theme) => ({
  root: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    boxShadow: 'none',
    borderTop: 'none',
    '&:before': {
      display: 'none'
    },
    '&:not(:last-child)': {
      borderBottom: 0
    }
  },
  expanded: {}
}))(MuiAccordion)

const AccordionSummary = withStyles((theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0, 0, 0, .125)'
  },
  expanded: {}
}))(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, .125)'
  }
}))(MuiAccordionDetails)

export default function ConnectMainActivity (props) {
  const { hidden, retracted } = props

  const [expanded, setExpanded] = useState('')

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Grid container item xs={12} role={'region'} aria-label={'Main Content'}>
      {/* user status list item */}
      <Accordion square expanded={expanded === 'userStatus'} aria-controls={'karunaStatusDrawer'} onChange={handleChange('userStatus')}>
        <AccordionSummary
          aria-label={'Current User Status'}
          expandIcon={<ExpandMore />}
          aria-controls="user-status-content"
          id="user-status-header"
        >
          <StatusListItem isUserStatus />
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
          aria-label={'Team Status'}
          expandIcon={<ExpandMore />}
          aria-controls="team-status-content"
          id="team-status-header"
        >
          <Typography>Team Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StatusListItem />
        </AccordionDetails>
      </Accordion>

      {/* Team Culture list item */}
      <Accordion square>
        <AccordionSummary
          aria-label={'Team Culture'}
          aria-controls="team-culture-content"
          id="team-culture-header"
        >
          <Typography>Team Culture</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant={'body2'}>WIP</Typography>
        </AccordionDetails>
      </Accordion>

      {/* NVC Information list item */}
      <Accordion square>
        <AccordionSummary
          aria-label={'NVC Information'}
          expandIcon={<ExpandMore />}
          aria-controls="nvc-info-content"
          id="nvc-info-header"
        >
          <Typography>NVC</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ListNVCElements />
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

ConnectMainActivity.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired
}
