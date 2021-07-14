/* global EventEmitter3 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import MessageTextWrapper from './KarunaTextBoxManager/MessageTextWrapper.jsx'

export default function KarunaTextBoxManager (props) {
  // De-construct the props
  const { emitter } = props

  // Track the list of text boxes in component state
  const [textBoxList, setTextBoxList] = useState([])
  useEffect(() => {
    emitter.on('updateTextBoxes', (incomingTextBoxes) => {
      setTextBoxList([...incomingTextBoxes])
    })
  }, [emitter, setTextBoxList])

  return (
    <React.Fragment>
      {textBoxList.map((textBox, i) => (
        <MessageTextWrapper key={i} textBox={textBox} />
      ))}
    </React.Fragment>
  )
}

KarunaTextBoxManager.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3)
}

KarunaTextBoxManager.defaultProps = {
  emitter: null
}
