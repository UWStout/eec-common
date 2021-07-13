/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'

import { Grid, Typography, Link, Collapse } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import StatusListItem from './StatusListItem.jsx'
import AffectSurveyList from '../AffectSurvey/AffectSurveyList.jsx'

import { StatusObjectShape, AffectObjectShape } from '../data/dataTypeShapes.js'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('CONNECT Main Content', 'lightblue', 'black')

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  }
}))

const Accordion = withStyles((theme) => ({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    paddingRight: theme.spacing(2),
    width: `calc(100% - ${theme.spacing(2)}px)`,
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
}))(MuiAccordion)

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: `calc(100% - ${theme.spacing(2)}px)`,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
}))(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiAccordionDetails)

export default function ConnectMainContent (props) {
  const { hidden, retracted, currentStatus, emojiList } = props
  const { root, heading } = useStyles()
  const [expanded, setExpanded] = useState('userStatus')
  const [selectedAffectID, setSelectedAffectID] = useState(currentStatus?.currentAffectID)
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
  }, [selectedAffectID])

  return (
    <div className={root}>
      {/* First list item: user status */}
      <Accordion square expanded={expanded === 'userStatus'} onChange={handleChange('userStatus')}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="user-status-content"
          id="user-status-header"
        >
          <StatusListItem currentStatus={currentStatus} affect={currentAffect} userEmail="Seth.berrier@gmail.com" />
        </AccordionSummary>
        <AccordionDetails id="user-status-content" aria-labelledby="users-status-header">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {'I\'m feeling: '}
                <Link href='#' onClick={() => setAffectSurveyOpen(!affectSurveyOpen)}>
                  {`${selectedAffect ? selectedAffect.characterCodes[0] : (currentAffect ? currentAffect.characterCodes[0] : '?')} ${selectedAffect ? selectedAffect.name : (currentAffect ? currentAffect.name : '[none]')}`}
                </Link>
              </Typography>
              <Collapse in={!hidden && affectSurveyOpen} timeout="auto" unmountOnExit>
                <AffectSurveyList selectedAffectID={selectedAffectID} setSelectedAffectID={setSelectedAffectID} noInteraction={hidden || retracted} onDismissSurvey={() => { setAffectSurveyOpen(false) }} {...props} />
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

      <Accordion square expanded={expanded === 'teamStatus'} onChange={handleChange('teamStatus')}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="team-status-content"
          id="team-status-header"
        >
          <Typography className={heading}>Team Status</Typography>
        </AccordionSummary>
        <AccordionDetails aria-labelledby="team-status-header" id="team-status-content">
          <StatusListItem emojiList={emojiList} userEmail="berriers@uwstout.edu" />
        </AccordionDetails>
      </Accordion>
      <Accordion square>
        <AccordionSummary
          aria-controls="team-culture"
          id="team-culture"
        >
          <Typography className={heading}>Team Culture</Typography>
        </AccordionSummary>
      </Accordion>

    </div>
  )
}

ConnectMainContent.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired,
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)).isRequired,
  currentStatus: PropTypes.shape(StatusObjectShape)
}

ConnectMainContent.defaultProps = {
  currentStatus: null
}
