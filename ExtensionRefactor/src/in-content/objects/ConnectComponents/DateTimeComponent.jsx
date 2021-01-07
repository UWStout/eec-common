import React, { useState } from 'react'
import { DatePicker, TimePicker, DateTimePicker } from '@material-ui/pickers'

export default function DateTimeComponent () {
  const [selectedDate, handleDateChange] = useState(new Date())

  return (
    <DateTimePicker value={selectedDate} onChange={handleDateChange} />
  )
}
