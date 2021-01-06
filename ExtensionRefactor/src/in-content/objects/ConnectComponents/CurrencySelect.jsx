import React, { useState } from 'react'
import { TextField, MenuItem } from '@material-ui/core'

export default function CurrencySelect () {
  const [currency, updateCurrency] = useState('$')

  return (
    <TextField
      select
      label="Select"
      value={currency}
      onChange={(e) => { updateCurrency(e.target.value) }}
      helperText="Please select your currency"
    >
      {'$€฿¥'.split('').map(c => (
        <MenuItem key={c} value={c}>
          {c}
        </MenuItem>
      ))}
    </TextField>
  )  
}
