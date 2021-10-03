/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { ActiveInputRefState } from '../data/globalSate/appState'

import { OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons'

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

  // Create the icon adornment (search icon or clear icon)
  let searchBarIcon = ''
  if (internalValue) {
    searchBarIcon = (
      <InputAdornment position="end">
        <IconButton
          size="small"
          aria-label={'Clear search text'}
          onClick={() => { handleValueChange('') }}
          disableFocusRipple
          disableRipple
        >
          <ClearIcon />
        </IconButton>
      </InputAdornment>
    )
  } else {
    searchBarIcon = (
      <InputAdornment position="end">
        <SearchIcon />
      </InputAdornment>
    )
  }

  return (
    <OutlinedInput
      value={internalValue}
      onChange={(e) => handleValueChange(e.target.value)}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
      endAdornment={searchBarIcon}
      margin="dense"
      fullWidth
      {...restProps}
    />
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
