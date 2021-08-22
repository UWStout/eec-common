import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '40%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  expandedBorder: {
    borderTop: '1px solid lightgray'
  }
}))

export default function InstructionPanel (props) {
  const { name, expanded, handleChange, headerText, headerSecondary, children } = props
  const classes = useStyles()

  return (
    <Accordion
      expanded={expanded === name}
      onChange={handleChange && handleChange(name)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${name}-content`}
        id={`${name}-header`}
      >
        <Typography className={classes.heading}>{headerText}</Typography>
        {headerSecondary &&
          <Typography className={classes.secondaryHeading}>
            {headerSecondary}
          </Typography>}
      </AccordionSummary>
      <AccordionDetails classes={{ root: classes.expandedBorder }}>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

InstructionPanel.propTypes = {
  name: PropTypes.string,
  expanded: PropTypes.string,
  handleChange: PropTypes.func,
  headerText: PropTypes.string.isRequired,
  headerSecondary: PropTypes.string,
  children: PropTypes.node.isRequired
}

InstructionPanel.defaultProps = {
  name: 'unnamed-panel',
  expanded: '',
  handleChange: null,
  headerSecondary: ''
}
