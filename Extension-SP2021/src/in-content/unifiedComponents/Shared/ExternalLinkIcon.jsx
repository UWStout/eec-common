import React from 'react'

import { SvgIcon } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ExternalLinkIcon (props) {
  return (
    <SvgIcon {...props}>
      <FontAwesomeIcon icon="external-link-alt" />
    </SvgIcon>
  )
}
