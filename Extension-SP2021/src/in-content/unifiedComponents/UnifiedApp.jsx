/* global EventEmitter3 */

import React from 'react'
import PropTypes from 'prop-types'

import { CssBaseline } from '@material-ui/core'

import ConnectComponent from './ConnectComponent.jsx'

// Colorful logger
// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('CONNECT Component', 'lavender', 'black')

// The sidebar Karuna Connect object
export default function UnifiedApp (props) {
  const { emitter, context } = props

  return (
    <React.Fragment>
      <CssBaseline />
      <ConnectComponent context={context} emitter={emitter} />
    </React.Fragment>
  )
}

UnifiedApp.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3),
  context: PropTypes.string
}

UnifiedApp.defaultProps = {
  emitter: null,
  context: 'unknown'
}
