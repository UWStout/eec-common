import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { Timer, Help } from '@material-ui/icons'

import CustomTooltip from '../KarunaConnect/CustomTooltip.jsx'
import { TimeToRespondShape } from '../data/dataTypeShapes.js'

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled
  }
}))

// We need this some other places too
export function rawTimeToRespondIcon (time, fontSize = 'medium') {
  if (!time) {
    return <Help fontSize={fontSize} />
  }

  return <Timer fontSize={fontSize} />
}

export default function TimeToRespondIcon (props) {
  // De-construct props
  const { fontSize, variant, timeToRespond, disabled, ...restProps } = props
  const { disabledText } = useStyles()

  return (
    <CustomTooltip {...restProps} title={timeToRespond ? `${timeToRespond.time} ${timeToRespond.units}` : 'Unknown'}>
      <Typography variant={variant} align='center' className={disabled ? disabledText : ''}>
        {rawTimeToRespondIcon(timeToRespond?.time, fontSize)}
      </Typography>
    </CustomTooltip>
  )
}

TimeToRespondIcon.propTypes = {
  fontSize: PropTypes.string,
  variant: PropTypes.string,
  timeToRespond: PropTypes.shape(TimeToRespondShape),
  disabled: PropTypes.bool
}

TimeToRespondIcon.defaultProps = {
  fontSize: 'medium',
  variant: 'body1',
  timeToRespond: null,
  disabled: false
}
