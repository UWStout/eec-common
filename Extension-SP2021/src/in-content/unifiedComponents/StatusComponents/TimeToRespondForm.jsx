import React, { useState } from 'react'

import { useRecoilState } from 'recoil'
import { TimeToRespondState } from '../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { TextField, InputAdornment, FormControlLabel, Select, MenuItem, Checkbox, Typography } from '@material-ui/core'
import { rawTimeToRespondIcon } from '../Shared/TimeToRespondIcon.jsx'

const useStyles = makeStyles((theme) => ({
  indentLeft: {
    marginLeft: theme.spacing(2)
  },
  indentLeftText: {
    display: 'flex',
    marginLeft: theme.spacing(2),
    color: theme.palette.grey['600']
  },
  shortIndentLeft: {
    width: '60%',
    marginLeft: theme.spacing(2)
  }
}))

export default function TimeToRespondForm (props) {
  const { shortIndentLeft, indentLeft, indentLeftText } = useStyles()

  const [timeToRespond, setTimeToRespond] = useRecoilState(TimeToRespondState)
  const [automatic, setAutomatic] = useState(timeToRespond?.automatic)
  const [time, setLocalTTR] = useState(timeToRespond?.time)
  const [units, setUnits] = useState(timeToRespond?.units)

  const synchronizeTTR = (newTime, newUnits, newAuto) => {
    setTimeToRespond({ time: newTime, units: newUnits, automatic: newAuto })
  }

  return (
    <React.Fragment>
      <TextField
        type="number"
        value={time}
        onChange={(e) => {
          setLocalTTR(parseInt(e.target.value))
          synchronizeTTR(parseInt(e.target.value), units, automatic)
        }}
        min={0}
        max={99}
        disabled={automatic}
        className={shortIndentLeft}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {rawTimeToRespondIcon(time)}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Select
                value={units}
                onChange={(e) => {
                  setUnits(e.target.value)
                  synchronizeTTR(time, e.target.value, automatic)
                }}
                aria-label={'Time to Respond units'}
                disabled={automatic}
                disableUnderline
              >
                <MenuItem value={'m'}>m</MenuItem>
                <MenuItem value={'h'}>h</MenuItem>
                <MenuItem value={'d'}>d</MenuItem>
              </Select>
            </InputAdornment>
          )
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={automatic}
            onChange={(e) => {
              setAutomatic(e.target.checked)
              synchronizeTTR(time, units, e.target.checked)
            }}
            name="time-to-respond-auto"
          />
        }
        label="Keep track for me"
        className={indentLeft}
      />
      <Typography variant="caption" className={indentLeftText}>
        {'If selected, Karuna will automatically set based on an average of your response times.'}
      </Typography>
    </React.Fragment>
  )
}
