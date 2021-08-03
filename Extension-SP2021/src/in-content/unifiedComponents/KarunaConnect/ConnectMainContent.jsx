/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { AffectListState, SelectedAffectSurveyState, UserStatusState } from '../data/globalState.js'

import { withStyles } from '@material-ui/core/styles'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

import { Grid, Typography, Link, Collapse } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import StatusListItem from './StatusListItem.jsx'
import AffectSurveyList from '../AffectSurvey/AffectSurveyList.jsx'
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

export default function ConnectMainContent (props) {
  const { hidden, retracted } = props

  // Subscribe to the global emojiList state and current status (GLOBAL STATE)
  const emojiList = useRecoilValue(AffectListState)
  const currentStatus = useRecoilValue(UserStatusState)

  const [expanded, setExpanded] = useState('')
  const selectedAffectID = useRecoilValue(SelectedAffectSurveyState)
  const [selectedAffect, setSelectedAffect] = useState(null)

  // open affect survey
  const [affectSurveyOpen, setAffectSurveyOpen] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const currentAffect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  useEffect(() => {
    const affect = emojiList.find((item) => {
      if (selectedAffectID) return item._id === selectedAffectID
      else return item._id === currentStatus?.currentAffectID
    })
    setSelectedAffect(affect)
  }, [currentStatus?.currentAffectID, emojiList, selectedAffectID])

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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {'I\'m feeling: '}
                <Link
                  aria-label={'Open Affect Survey'}
                  href='#'
                  onClick={() => setAffectSurveyOpen(!affectSurveyOpen)}
                >
                  {`${selectedAffect ? selectedAffect.characterCodes[0] : (currentAffect ? currentAffect.characterCodes[0] : '?')} ${selectedAffect ? selectedAffect.name : (currentAffect ? currentAffect.name : '[none]')}`}
                </Link>
              </Typography>
              <Collapse in={!hidden && affectSurveyOpen} timeout="auto" unmountOnExit>
                <AffectSurveyList noInteraction={hidden || retracted} onDismissSurvey={() => { setAffectSurveyOpen(false) }} />
              </Collapse>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                {'My collaboration status is: '}
                {currentStatus ? (currentStatus.collaboration ? '🧑‍🤝‍🧑' : '🧍') : '?'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                {`I generally take ${currentStatus?.timeToRespond > 0 ? (currentStatus.timeToRespond / 60).toFixed(1) : '?'}h to respond`}
              </Typography>
            </Grid>
          </Grid>
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

ConnectMainContent.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired
}
