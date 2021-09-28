import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Button, TextField, FormControlLabel, Checkbox, Link, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    borderBottom: '1px solid lightgray'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  captionTextStyle: {
    paddingBottom: theme.spacing(2),
    borderBottom: '1px solid lightgray'
  }
}))

export default function SignInForm (props) {
  // Create the class names for styling
  const classes = useStyles()

  // De-construct props
  const { signInUserCallback } = props

  // Track user form state
  const [emailState, setEmailState] = useState('')
  const [passwordState, setPasswordState] = useState('')
  const [rememberMeState, setRememberMeState] = useState(false)

  // Track form feedback states
  const [errorMessage, setErrorMessage] = useState('')
  const [submitEnabled, setSubmitEnabled] = useState(true)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Event handler for form submission
  const onFormSubmit = async (e) => {
    // Prevent page reloading and re-submission
    e.preventDefault()
    setSubmitEnabled(false)

    // Attempt to sign in
    signInUserCallback(
      emailState,
      passwordState,
      (rememberMeState ? 168 : 24),
      () => { setSubmitSuccess(true) },
      (err) => {
        if (err?.response?.status === 429) {
          setErrorMessage('Too many failed attempts (wait 10 seconds)')
        } else {
          setErrorMessage('Invalid username and/or password')
        }
        setSubmitEnabled(true)
      }
    )
  }

  return (
    <div className={classes.paper}>
      <KarunaIcon />
      <Typography component="h1" variant="h5">
        {'Admin/Manager Sign in'}
      </Typography>
      <form className={classes.form} noValidate onSubmit={onFormSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          error={errorMessage !== ''}
          onChange={(e) => { setEmailState(e.target.value); setErrorMessage('') }}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          error={errorMessage !== ''}
          helperText={errorMessage !== '' ? errorMessage : ' '}
          onChange={(e) => { setPasswordState(e.target.value); setErrorMessage('') }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" onChange={(e) => { setRememberMeState(e.target.checked) }} />}
          label="Remember me for 7 days"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color={submitSuccess ? 'success' : 'primary'}
          className={classes.submit}
          disabled={!submitEnabled}
        >
          {submitSuccess ? 'Success' : 'Sign In'}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="./Recovery.html" target="_blank" variant="body2">
              {'Forgot password?'}
            </Link>
          </Grid>
          <Grid item>
            <Link href="./Register.html" target="_blank" variant="body2">
              {'Don\'t have an account? Sign Up'}
            </Link>
          </Grid>
        </Grid>
      </form>
      <Typography variant="body1" color="textSecondary" className={classes.captionTextStyle}>
        {'Note: This sign in form is for viewing team settings and administrators only.'}
        <br />
        <br />
        {'If you are trying to sign in to the normal extension, '}
        <Link target="_blank" href="./instructions.html">{'install the karuna extension'}</Link>
        {', then visit '}
        <Link target="_blank" href="https://teams.microsoft.com">{'teams.microsoft.com'}</Link>
        {' or '}
        <Link target="_blank" href="https://discord.com">{'discord.com'}</Link>
        {' and click the karuna bubble in the lower right of the page.'}
      </Typography>
    </div>
  )
}

SignInForm.propTypes = {
  signInUserCallback: PropTypes.func.isRequired
}
