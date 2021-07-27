/* global EventEmitter3 */

import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { TextBoxMapState } from './data/globalState.js'

import MessageTextWrapper from './KarunaTextBoxManager/MessageTextWrapper.jsx'

// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('MESSAGE Manager', 'yellow', 'black')

export default function KarunaTextBoxManager (props) {
  const { emitter } = props
  const textBoxMap = useRecoilValue(TextBoxMapState)

  const wrappers = []
  textBoxMap.forEach((textBox, textBoxId) => {
    wrappers.push(<MessageTextWrapper key={textBoxId} textBox={textBox} emitter={emitter} />)
  })

  return (wrappers)
}

MessageTextWrapper.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3)
}

MessageTextWrapper.defaultProps = {
  emitter: null
}
