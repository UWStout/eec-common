import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Typography, Badge } from '@material-ui/core'
import { Timer, Help } from '@material-ui/icons'

import { TimeToRespondShape } from '../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled
  }
}))

const StyledBadge = withStyles((theme) => ({
  badge: {
    top: -theme.spacing(0.25),
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  }
}))(Badge)

// We need this some other places too
export function rawTimeToRespondIcon (time, fontSize = 'medium') {
  if (!time) {
    return <Help fontSize={fontSize} />
  }

  return <Timer fontSize={fontSize} />
}

export default function TimeToRespondIcon (props) {
  // De-construct props
  const { fontSize, variant, timeToRespond, disabled, flipped } = props
  const { disabledText } = useStyles()

  return (
    <StyledBadge
      badgeContent={(timeToRespond ? `${timeToRespond.time}${timeToRespond.units}` : '')}
      invisible={!timeToRespond}
      anchorOrigin={{ vertical: 'bottom', horizontal: (flipped ? 'left' : 'right') }}
      color="primary"
    >
      <Typography variant={variant} align='center' className={disabled ? disabledText : ''}>
        {rawTimeToRespondIcon(timeToRespond?.time, fontSize)}
      </Typography>
    </StyledBadge>
  )
}

TimeToRespondIcon.propTypes = {
  fontSize: PropTypes.string,
  variant: PropTypes.string,
  timeToRespond: PropTypes.shape(TimeToRespondShape),
  disabled: PropTypes.bool,
  flipped: PropTypes.bool
}

TimeToRespondIcon.defaultProps = {
  fontSize: 'medium',
  variant: 'body1',
  timeToRespond: null,
  disabled: false,
  flipped: false
}
