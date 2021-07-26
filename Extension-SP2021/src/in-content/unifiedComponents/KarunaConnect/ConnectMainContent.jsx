/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { AffectListState, SelectedAffectSurveyState, UserStatusState } from '../data/globalState.js'

import { makeStyles, withStyles } from '@material-ui/core/styles'

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

const useStyles = makeStyles((theme) => ({
  // AIW Testing styling
  // root: {
  //   width: '100%'
  // },
  // heading: {
  //   fontSize: theme.typography.pxToRem(15)
  // }
}))

const Accordion = withStyles((theme) => ({
  root: {
    width: theme.spacing(36),
    boxShadow: 'none',
    borderTop: 'none',
    '&:before': {
      display: 'none'
    }
    // AIW Testing styling
    // border: '1px solid rgba(0, 0, 0, .125)',
    // boxShadow: 'none',
    // paddingRight: theme.spacing(2),
    // width: `calc(100% - ${theme.spacing(2)}px)`,
    // '&:not(:last-child)': {
    //   borderBottom: 0
    // },
    // '&:before': {
    //   display: 'none'
    // },
    // '&$expanded': {
    //   margin: 'auto'
    // }
  },
  expanded: {}
}))(MuiAccordion)

const AccordionSummary = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderBottom: '1px solid rgba(0, 0, 0, .125)'
    // AIW Testing styling
    // backgroundColor: 'rgba(0, 0, 0, .03)',
    // borderBottom: '1px solid rgba(0, 0, 0, .125)',
    // marginBottom: -1,
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2),
    // width: `calc(100% - ${theme.spacing(2)}px)`,
    // minHeight: 56,
    // '&$expanded': {
    //   minHeight: 56
    // }
  },
  content: {
    // AIW Testing styling
    // '&$expanded': {
    //   margin: '12px 0'
    // }
  },
  expanded: {}
}))(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderBottom: '1px solid rgba(0, 0, 0, .125)'
    // AIW Testing styling
    // padding: theme.spacing(2)
  }
}))(MuiAccordionDetails)

export default function ConnectMainContent (props) {
  const { hidden, retracted } = props
  const { rootAccordionStyle, heading } = useStyles()

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
    // AIW Testing styling
    // <div className={root}>
    <Grid container item xs={12} role={'region'} aria-label={'Main Content'}>
      {/* First list item: user status */}
      <Accordion square className={rootAccordionStyle} expanded={expanded === 'userStatus'} onChange={handleChange('userStatus')}>
        <AccordionSummary
          aria-label={'Current User Status'}
          expandIcon={<ExpandMore />}
          aria-controls="user-status-content"
          id="user-status-header"
        >
          <StatusListItem affect={currentAffect} userEmail="Seth.berrier@gmail.com" />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                {'I\'m feeling: '}
                <Link href='#' onClick={() => setAffectSurveyOpen(!affectSurveyOpen)}>
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

      <Accordion square expanded={expanded === 'teamStatus'} onChange={handleChange('teamStatus')}>
        <AccordionSummary
          aria-label={'Team Status'}
          expandIcon={<ExpandMore />}
          aria-controls="team-status-content"
          id="team-status-header"
        >
          <Typography className={heading}>Team Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StatusListItem emojiList={emojiList} userEmail="berriers@uwstout.edu" />
        </AccordionDetails>
      </Accordion>
      <Accordion square>
        <AccordionSummary
          aria-label={'Team Culture'}
          aria-controls="team-culture-content"
          id="team-culture-header"
        >
          <Typography className={heading}>Team Culture</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant={'body2'}>WIP</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion square>
        <AccordionSummary
          aria-label={'NVC Information'}
          expandIcon={<ExpandMore />}
          aria-controls="nvc-info-content"
          id="nvc-info-header"
        >
          <Typography className={heading}>NVC</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ListNVCElements />
        </AccordionDetails>
      </Accordion>
    </Grid>
    // AIW Testing styling
    // </div>
  )
}

ConnectMainContent.propTypes = {
  hidden: PropTypes.bool.isRequired,
  retracted: PropTypes.bool.isRequired
}
