import React, { useState } from 'react'

import { useRecoilState, useSetRecoilState } from 'recoil'
import { TimeToRespondState } from '../data/globalSate/userState.js'
import { PopActivityState } from '../data/globalSate/appState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, FormControl, FormControlLabel, Checkbox, TextField, Select, MenuItem, Button } from '@material-ui/core'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('Time To Respond Activity', 'purple', 'white')

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%'
  },
  indent: {
    marginLeft: theme.spacing(2)
  }
}))

export default function TimeToRespondActivity (props) {
  const { fullWidth, indent } = useStyles()

  // Global activity states
  const popActivity = useSetRecoilState(PopActivityState)
  const [timeToRespond, setTimeToRespond] = useRecoilState(TimeToRespondState)

  const [automatic, setAutomatic] = useState(timeToRespond.automatic)
  const [localTTR, setLocalTTR] = useState(timeToRespond.time)
  const [units, setUnits] = useState(timeToRespond.units)

  // Respond to the dialog closing
  const onDialogClose = () => {
    setTimeToRespond({
      time: localTTR,
      units
    })

    // Dismiss the activity
    popActivity(ACTIVITIES.TIME_TO_RESPOND_SURVEY.key)
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography>
          {'I typically respond in:'}
        </Typography>
      </Grid>

      <Grid item xs={5}>
        <TextField
          type="number"
          value={localTTR}
          onChange={(e) => { setLocalTTR(parseInt(e.target.value)) }}
          min={0}
          max={99}
          disabled={automatic}
        />
      </Grid>
      <Grid item xs={8}>
        <Typography>
          <FormControl>
            <Select
              value={units}
              onChange={(e) => { setUnits(e.target.value) }}
              aria-label={'Time to Respond units'}
              disabled={automatic}
            >
              <MenuItem value={'m'}>Minute(s)</MenuItem>
              <MenuItem value={'h'}>Hour(s)</MenuItem>
              <MenuItem value={'d'}>Day(s)</MenuItem>
            </Select>
          </FormControl>
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={automatic}
              onChange={(e) => { setAutomatic(e.target.checked) }}
              name="time-to-respond-auto"
            />
          }
          label="Keep track for me"
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="caption" color="disabled" className={indent}>
          {'If selected, Karuna will automatically set based on an average of your response times.'}
        </Typography>
      </Grid>

      {/* Trigger the Login */}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" className={fullWidth} onClick={onDialogClose}>
          {'Save'}
        </Button>
      </Grid>

    </Grid>
  )
}
