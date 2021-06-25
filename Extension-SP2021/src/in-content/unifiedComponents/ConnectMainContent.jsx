/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import { Grid, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'

import StatusListItem from './StatusListItem.jsx'
import AffectSurvey from './AffectSurvey.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  link: {
    color: 'blue'
  }
}))

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
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
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
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
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiAccordionDetails)

export default function ConnectMainContent () {
  const { root, link, heading } = useStyles()
  const [expanded, setExpanded] = useState('userStatus')

  // open affect survey
  const [affectSurveyOpen, setAffectSurveyOpen] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div className={root}>
      {/* First list item: user status */}
      <Accordion square expanded={expanded === 'userStatus'} onChange={handleChange('userStatus')}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="user-status-content"
          id="user-status-header"
        >
          <StatusListItem userEmail="Seth.berrier@gmail.com" />
        </AccordionSummary>
        <AccordionDetails id="user-status-content" aria-labelledby="users-status-header">
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1">
                I'm feeling: <a className={link} onClick={() => setAffectSurveyOpen(!affectSurveyOpen)}> 😒 meh </a>
              </Typography>
              <br />
              {affectSurveyOpen ? <AffectSurvey /> : null}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">My collaboration status is: 👬</Typography><br />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">I generally take 52h to respond</Typography>
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
          <StatusListItem userEmail="berriers@uwstout.edu" />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

ConnectMainContent.propTypes = {

}
