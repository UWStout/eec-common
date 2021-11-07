import React, { useState, useEffect } from 'react'

import { useRecoilValue, useRecoilState } from 'recoil'
import { DisableInputState, SubmitRequestState } from '../data/globalSate/appState.js'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, FormControlLabel, Checkbox } from '@material-ui/core'

import ExternalLink from '../Shared/ExternalLink.jsx'
import TunneledTextField from '../Shared/TunneledTextField.jsx'

import * as BACKGROUND from '../data/backgroundHelper.js'
import { HOST_NAME } from '../../../util/serverConfig.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Login Activity', 'lightblue', 'black')

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%'
  }
}))

export default function ConnectLoginActivity (props) {
  const { fullWidth } = useStyles()

  // Local form value state
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitEnabled, setSubmitEnabled] = useState(true)

  // Get global input state
  const disableAllInput = useRecoilValue(DisableInputState)
  const [submitRequested, setSubmitRequest] = useRecoilState(SubmitRequestState)

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked)
  }

  const validateLogin = () => {
    setSubmitEnabled(false)
    BACKGROUND.login(
      email,
      password,
      (rememberMe ? 168 : 24),
      (message, err) => {
        if (err?.response?.status === 429) {
          setErrorMessage('Too many failed attempts (wait 10 seconds)')
        } else {
          setErrorMessage('Invalid username and/or password')
        }
        setSubmitEnabled(true)
      }
    )
  }

  useEffect(() => {
    if (submitRequested && submitEnabled) {
      setSubmitRequest(false)
      validateLogin()
    }
  }, [submitRequested, submitEnabled])

  return (
    <Grid container item direction={'column'} spacing={2} role={'region'} aria-label={'Login Activity'}>
      <Grid item>
        {/* Account primary name */}
        <TunneledTextField
          id="login-email"
          label="Email"
          className={fullWidth}
          value={email}
          onChange={(val) => { setEmail(val); setErrorMessage('') }}
          error={errorMessage !== ''}
          disabled={disableAllInput}
        />
        <ExternalLink href={`https://${HOST_NAME}/Register.html`} small disabled={disableAllInput} tabIndex={-1}>
          {'I need an account'}
        </ExternalLink>
      </Grid>

      <Grid item>
        {/* Account password */}
        <TunneledTextField
          id="login-password"
          label="Password"
          type="password"
          className={fullWidth}
          value={password}
          onChange={(val) => { setPassword(val); setErrorMessage('') }}
          error={errorMessage !== ''}
          helperText={errorMessage !== '' ? errorMessage : ' '}
          disabled={disableAllInput}
        />
        <ExternalLink href={`https://${HOST_NAME}/Recovery.html`} small disabled={disableAllInput} tabIndex={-1}>
          {'Forgot password?'}
        </ExternalLink>
      </Grid>

      <Grid item>
        {/* Remember Me */}
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={handleCheckboxChange}
              name="login-remember-me"
              disabled={disableAllInput}
            />
          }
          label="Remember me for 7 days"
        />
      </Grid>

      {/* Trigger the Login */}
      <Grid item>
        <Button variant="contained" color="primary" className={fullWidth} onClick={validateLogin} disabled={!submitEnabled || disableAllInput}>
          {'Login'}
        </Button>
      </Grid>
    </Grid>
  )
}
