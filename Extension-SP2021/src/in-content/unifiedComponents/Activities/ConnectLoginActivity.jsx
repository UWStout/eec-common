import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Button, TextField, FormControlLabel, Checkbox, Typography } from '@material-ui/core'
import ExternalLink from '../Shared/ExternalLink.jsx'

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
  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked)
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
          className={fullWidth}
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
        <Button variant="contained" color="primary" className={fullWidth}>
          {'Login'}
        </Button>
      </Grid>
    </Grid>
  )
}
