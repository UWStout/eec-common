import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import ExternalLink from '../Shared/ExternalLink.jsx'

import * as BACKGROUND from '../data/backgroundHelper.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Main Content', 'lightblue', 'black')

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%'
  }
}))

export default function ConnectLoginActivity (props) {
  const { fullWidth } = useStyles()
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasError, setHasError] = useState(false)

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
        <TextField
          id="login-email"
          label="Email"
          helperText="Please enter your email"
          className={fullWidth}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setHasError(false) }}
          error={hasError}
        />
        <ExternalLink href="https://localhost:3000/register.html">
          {'I need an account'}
        </ExternalLink>
      </Grid>

      <Grid item>
        {/* Account password */}
        <TextField
          id="login-password"
          label="Password"
          helperText="Please enter you password"
          type="password"
          className={fullWidth}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setHasError(false) }}
          error={hasError}
        />
        <ExternalLink href="https://localhost:3000/">
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
            />
          }
          label="Remember me for 7 days"
        />
      </Grid>

      {/* Trigger the Login */}
      <Grid item>
        <Button variant="contained" color="primary" className={fullWidth} onClick={validateLogin}>
          {'Login'}
        </Button>
      </Grid>
    </Grid>
  )
}
