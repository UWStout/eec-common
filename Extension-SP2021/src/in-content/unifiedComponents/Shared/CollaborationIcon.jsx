import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@material-ui/core'
import { PeopleAlt, PersonAddDisabled, PersonAdd, Help } from '@material-ui/icons'

import CustomTooltip from '../KarunaConnect/CustomTooltip.jsx'

// We need this some other places too
export function rawCollaborationIcon (collaboration, fontSize = 'medium') {
  if (!collaboration) {
    return <Help fontSize={fontSize} />
  }

  if (collaboration?.toLowerCase().includes('open')) {
    return <PersonAdd fontSize={fontSize} />
  }

  if (collaboration?.toLowerCase().includes('collaborating')) {
    return <PeopleAlt fontSize={fontSize} />
  }

  return <PersonAddDisabled fontSize={fontSize} />
}

export default function CollaborationIcon (props) {
  // De-construct props
  const { collaboration, variant, fontSize, ...restProps } = props

  return (
    <CustomTooltip {...restProps} title={collaboration || 'Unknown'}>
      <Typography variant={variant} align='center'>
        {rawCollaborationIcon(collaboration, fontSize)}
      </Typography>
    </CustomTooltip>
  )
}

CollaborationIcon.propTypes = {
  collaboration: PropTypes.string,
  variant: PropTypes.string,
  fontSize: PropTypes.string
}

CollaborationIcon.defaultProps = {
  collaboration: null,
  variant: 'body1',
  fontSize: 'medium'
}
