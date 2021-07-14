import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import Highlighter from './Highlighter.jsx'
import { computeWordRects } from './WordSpanner.js'

// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('MESSAGE Wrapper', 'maroon', 'white')

// DEBUG: Just for testing
const highlightWordList = ['test', 'seth', 'the']

const useStyles = makeStyles((theme) => ({
  outerWrapper: {
    position: 'absolute',
    pointerEvents: 'none', // ${disablePointerEvents ? 'pointer-events: none;' : ''}
    top: '0px',
    left: '0px'
  },

  middleDiv: {
    boxSizing: 'content-box',
    border: '0px',
    borderRadius: '0px',
    padding: '0px',
    margin: '0px',

    position: 'relative',
    pointerEvents: 'none', // ${disablePointerEvents ? 'pointer-events: none;' : ''}
    overflow: 'hidden'
  },

  innerDiv: {
    width: window.innerWidth,
    height: window.innerHeight
  }
}))

export default function MessageTextWrapper (props) {
  // Deconstruct the props and style class names
  const { textBox } = props
  const { outerWrapper, middleDiv, innerDiv } = useStyles()

  // Track the text box as a jQuery element in component state
  const [textBoxJQElem, setTextBoxJQElem] = useState(null)

  // Track the highlighted words
  const [highlightRects, setHighlightRects] = useState([])
  const updateUnderlinedWords = (JQTextBox) => {
    try {
      const rects = computeWordRects(JQTextBox, highlightWordList)
      LOG('Computed rects:', rects)
      setHighlightRects(rects)
    } catch (err) {
      LOG.error('Error computing word rects', err)
    }
  }

  // Respond to change in textBox param
  useEffect(() => {
    // Setup event listeners for the text box
    const newJQElem = jQuery(textBox)
    const wordUnderlineCallback = updateUnderlinedWords.bind(newJQElem)
    newJQElem.on('focusin', () => { wordUnderlineCallback(newJQElem) })
    newJQElem.on('focusout', () => { wordUnderlineCallback(newJQElem) })
    newJQElem.on('input', () => { wordUnderlineCallback(newJQElem) })

    // Store jQuery element of textbox in state
    setTextBoxJQElem(newJQElem)
  }, [textBox])

  // Build the highlighted words elements
  const highlightedWords = highlightRects.map((rect, i) => (
    <Highlighter key={i} rect={rect} />
  ))

  return (
    <div className={outerWrapper}>
      <div
        className={middleDiv}
        style={{
          top: textBoxJQElem?.offset().top,
          left: textBoxJQElem?.offset().left,
          width: textBoxJQElem?.outerWidth(),
          height: textBoxJQElem?.outerHeight()
        }}
      >
        <div className={innerDiv}>
          {highlightedWords}
        </div>
      </div>
    </div>
  )
}

MessageTextWrapper.propTypes = {
  textBox: PropTypes.instanceOf(Element).isRequired
}
