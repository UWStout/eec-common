/* global EventEmitter3 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import debounce from 'debounce'

import { useRecoilValue } from 'recoil'
import { ActiveKarunaMessageState } from '../data/globalSate/globalState'

import { makeStyles } from '@material-ui/core/styles'

import Highlighter from './Highlighter.jsx'
import { computeWordRects } from './WordSpanner.js'

import { updateMessageText } from './BackgroundMessager.js'

// Colorful logger
// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('MESSAGE Wrapper', 'maroon', 'white')

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
  const { textBox, emitter } = props
  const { outerWrapper, middleDiv, innerDiv } = useStyles()

  // Global state for identified NVC element
  // const setIsNVCIndicated = useSetRecoilState(NVCIdentifiedState)
  const activeKarunaMessage = useRecoilValue(ActiveKarunaMessageState)

  // Track the text box as a jQuery element in component state
  const [textBoxJQElem, setTextBoxJQElem] = useState(null)

  // Track the highlighted words
  const [highlightRects, setHighlightRects] = useState([]) // array of objects

  // For tracking what ranges have been highlighted already
  const isCovered = useRef([])
  const setIsCovered = (index) => {
    isCovered.current[index] = true
  }

  // Update highlightRangeList when karunaMessage changes
  const highlightRangeList = useMemo(() => {
    if (activeKarunaMessage?.entities) {
      const rangeList = []
      activeKarunaMessage.entities.forEach(entity => {
        rangeList.push(entity.location)
      })
      // console.log('highlightRangeList is', rangeList)
      return rangeList
    }
  }, [activeKarunaMessage])

  const updateUnderlinedWords = useCallback((JQTextBox) => {
    try {
    // highlightObjectsList would be the result from analyzing the text for entities with Watson
    // watson returns entities = response.output.entities
    // entities.location is an array with start and end
    // entities.value is the word
      const spanWords = false // span words or span ranges
      const spanList = (spanWords ? highlightWordList : highlightRangeList)
      let rects = computeWordRects(spanWords, JQTextBox, spanList, isCovered.current, setIsCovered)
      if (rects.length === 0) {
        if (highlightRangeList) isCovered.current = new Array(highlightRangeList.length).fill(false)
        rects = computeWordRects(spanWords, JQTextBox, spanList, isCovered.current, setIsCovered)
      }

      // LOG('Computed rects:', rects)
      setHighlightRects(rects)
    } catch (err) {
      // LOG.error('Error computing word rects', err)
    }
  }, [highlightRangeList])

  // Respond to change in textBox param
  useEffect(() => {
    // LOG('Installing text-box listeners')

    // Setup event listeners for the text box
    const newJQElem = jQuery(textBox)
    newJQElem.on('focusin', () => { updateUnderlinedWords(newJQElem) })
    newJQElem.on('focusout', () => { updateUnderlinedWords(newJQElem) })

    newJQElem.on('input', debounce((event) => {
      // LOG('INPUT')
      updateUnderlinedWords(newJQElem)

      // Send a message text update to the root element, where it will be bounced
      // to the background (and then to the server).
      // TODO: Use the correct context name on updateMessageText()
      if (emitter) {
        const [content, mentions] = updateMessageText(event, newJQElem)
        emitter.emit('textUpdate', { content, mentions })
      }
    }, 200))

    // Store jQuery element of textbox in state
    setTextBoxJQElem(newJQElem)

    // Create cleanup function
    return () => {
      // LOG('Removing text-box listeners')
      newJQElem.off('focusin')
      newJQElem.off('focusout')
      newJQElem.off('input')
    }
  }, [emitter, textBox, updateUnderlinedWords])

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
  textBox: PropTypes.instanceOf(Element).isRequired,
  emitter: PropTypes.instanceOf(EventEmitter3)
}

MessageTextWrapper.defaultProps = {
  emitter: null
}
