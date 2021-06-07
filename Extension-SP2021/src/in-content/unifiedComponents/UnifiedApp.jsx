/* global EventEmitter3 */

import React from 'react'
import PropTypes from 'prop-types'

import ConnectComponent from './ConnectComponent.jsx'

// Colorful logger
// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('CONNECT Component', 'lavender', 'black')

// The sidebar Karuna Connect object
export default function UnifiedApp (props) {
  const { emitter, context } = props

  return (
    <ConnectComponent emitter={emitter} context={context} />
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
