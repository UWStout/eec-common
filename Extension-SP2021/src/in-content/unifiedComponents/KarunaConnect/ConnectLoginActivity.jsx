import React, { useState } from 'react'

import { DisableInputState } from '../data/globalSate/appState.js'
import { useRecoilValue } from 'recoil'

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
  const [hasError, setHasError] = useState(false)

  // Get global input state
  const disableAllInput = useRecoilValue(DisableInputState)

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked)
  }

  const validateLogin = () => {
    BACKGROUND.login(email, password, () => { setHasError(true) })
  }

  return (
    <Grid container item direction={'column'} spacing={2} role={'region'} aria-label={'Login Activity'}>
      <Grid item>
        {/* Account primary name */}
        <TunneledTextField
          id="login-email"
          label="Email"
          helperText="Please enter your email"
          className={fullWidth}
          value={email}
          onChange={(val) => { setEmail(val); setHasError(false) }}
          error={hasError}
          disabled={disableAllInput}
        />
        <ExternalLink href={`https://${HOST_NAME}/Register.html`} small disabled={disableAllInput}>
          {'I need an account'}
        </ExternalLink>
      </Grid>

      <Grid item>
        {/* Account password */}
        <TunneledTextField
          id="login-password"
          label="Password"
          helperText="Please enter you password"
          type="password"
          className={fullWidth}
          value={password}
          onChange={(val) => { setPassword(val); setHasError(false) }}
          error={hasError}
          disabled={disableAllInput}
        />
        <ExternalLink href={`https://${HOST_NAME}/Recovery.html`} small disabled={disableAllInput}>
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
        <Button variant="contained" color="primary" className={fullWidth} onClick={validateLogin} disabled={disableAllInput}>
          {'Login'}
        </Button>
      </Grid>
    </Grid>
  )
}
