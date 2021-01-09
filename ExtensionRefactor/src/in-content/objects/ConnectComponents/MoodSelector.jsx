import React, { useState } from 'react'
import { TextField, MenuItem } from '@material-ui/core'
import Emoji from './Emoji.jsx'
import { arrayIncludes } from '@material-ui/pickers/_helpers/utils'

const emoji = [
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />
]

export default function MoodSelect () {
  const [mood, setMood] = useState('')

  return (
    <TextField
      select
      label="Select"
      value={mood}
      onChange={(e) => { setMood(e.target.value) }}
      helperText="Please Select your mood"
    >
      <MenuItem key={emoji[0]} value={emoji[0]}>
        {emoji[0]}
      </MenuItem>
    </TextField>
  )
}
