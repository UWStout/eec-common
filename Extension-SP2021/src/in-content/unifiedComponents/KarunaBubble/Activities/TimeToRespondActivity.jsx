import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { TimeToRespondState } from '../../data/globalSate/userState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, Radio, RadioGroup, FormControlLabel } from '@material-ui/core'

import TunneledTextField from '../../Shared/TunneledTextField.jsx'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: '1px solid lightgrey'
  }
}))

/**
 * Manage the time-to-respond survey when shown in the bubble
 **/
const TimeToRespondBubbleActivity = React.forwardRef((props, ref) => {
  const { requestHide, cancelHide, allowNext } = props
  const { title } = useStyles()

  // Values and mutator functions for global state (GLOBAL STATE)
  const setTimeToRespondState = useSetRecoilState(TimeToRespondState)

  // Local state
  const [TTRValue, setTTRValue] = useState('')
  const [TTRUnits, setTTRUnits] = useState('m')

  // Respond to changes in TTR values
  useEffect(() => {
    if (TTRUnits !== '' && TTRValue !== '' && TTRValue > 0) {
      setTimeToRespondState({
        time: TTRValue,
        units: TTRUnits,
        automatic: false
      })
    }

    if (allowNext) {
      allowNext(TTRUnits !== '' && TTRValue !== '' && TTRValue > 0)
    }
  }, [TTRUnits, TTRValue, allowNext, setTimeToRespondState])

  // Show time-to-respond survey
  return (
    <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant={'body1'} className={title}>
            {'About how long are you taking to respond to messages right now?'}
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={1}>
          <Grid item xs={12}>
            <TunneledTextField
              type="number"
              value={TTRValue}
              placeholder={'enter a number'}
              onChange={(val) => {
                setTTRValue(parseInt(val))
              }}
              min={0}
              max={99}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
              aria-label="willingness to collaborate"
              name="collaboration"
              value={TTRUnits}
              onChange={(e) => { setTTRUnits(e.target.value) }}
            >
              <FormControlLabel value={'m'} control={<Radio color="default" />} label={'minutes'} />
              <FormControlLabel value={'h'} control={<Radio color="default" />} label={'hours'} />
              <FormControlLabel value={'d'} control={<Radio color="default" />} label={'days'} />
            </RadioGroup>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
})

TimeToRespondBubbleActivity.displayName = 'TimeToRespondBubbleActivity'

TimeToRespondBubbleActivity.propTypes = {
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  allowNext: PropTypes.func
}

TimeToRespondBubbleActivity.defaultProps = {
  requestHide: null,
  cancelHide: null,
  allowNext: null
}

export default TimeToRespondBubbleActivity
