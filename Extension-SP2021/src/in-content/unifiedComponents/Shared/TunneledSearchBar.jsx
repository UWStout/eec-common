import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { ActiveInputRefState } from '../data/globalSate/appState'

import SearchBar from 'material-ui-search-bar'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('TUNNELED Search Bar', 'purple', 'white')

export default function TunneledSearchBar (props) {
  // Deconstruct props
  const { value, onChange, ...restProps } = props

  // Track value internally
  const [internalValue, setInternalValue] = useState(value.toString())
  const handleValueChange = (newVal) => {
    setInternalValue(newVal)
    if (onChange) { onChange(newVal) }
  }

  // Provide means to manually append to value (for adding key strokes)
  const [append, setAppend] = useState('')
  useEffect(() => {
    if (append !== '') {
      const newVal = internalValue + append
      setInternalValue(newVal)
      if (onChange) { onChange(newVal) }
      setAppend('')
    }
  }, [append, internalValue, onChange])

  // Track focus in global state
  const setActiveInputRef = useSetRecoilState(ActiveInputRefState)
  const handleFocusIn = (e) => { setActiveInputRef({ append: setAppend }) }
  const handleFocusOut = (e) => { setActiveInputRef(null) }

  return (
    <SearchBar {...restProps} value={internalValue} onChange={handleValueChange} onCancelSearch={() => { handleValueChange('') }} onFocus={handleFocusIn} onBlur={handleFocusOut} />
  )
}

TunneledSearchBar.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func
}

TunneledSearchBar.defaultProps = {
  value: '',
  onChange: null
}
