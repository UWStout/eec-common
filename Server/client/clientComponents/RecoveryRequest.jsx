import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Grid, TextField, Typography, Box, Paper } from '@material-ui/core'

import { requestRecovery } from '../authHelper.js'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'
import { EMAIL_REGEX } from './AccountInfoForm.jsx'

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  margins: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6)
    }
  },
  logoStyle: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}))

export default function RecoveryRequest (props) {
  const classes = useStyles()

  // Track password and submit state
  const [email, setEmail] = useState('')
  const [helperText, setHelperText] = useState(' ')
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [submitEnabled, setSubmitEnabled] = useState(false)

  useEffect(() => {
    if (email.match(EMAIL_REGEX)) {
      setSubmitEnabled(true)
    } else {
      setSubmitEnabled(false)
    }
  }, [email])

  // Receive the new password and submit it
  const submitRecoveryRequest = async () => {
    setHelperText('sending request')
    setEmailEnabled(false)
    setSubmitEnabled(false)
    try {
      // Try to create new user
      await requestRecovery(email)
      setEmailEnabled(true)
      setHelperText('request was sent')
    } catch (err) {
      if (err?.response?.status === 429) {
        window.alert('Too many reset attempts (please wait 10 seconds)')
      } else {
        const message = (err?.response?.data?.message ? err.response.data.message : 'unknown error')
        window.alert(`Error requesting recovery. Please contact an administrator for help.\n\n(Info: ${message})`)
      }
    }
  }

  return (
    <div className={classes.layout}>
      <div className={classes.logoStyle}>
        <KarunaIcon />
        <Typography component="h1" variant="h5">
          {'Reset Account Password'}
        </Typography>
      </div>
      <Typography variant="body1">
        {'Enter your account email below. If an account exists with that email, '}
        {'a recovery message will be sent with further instructions.'}
        <br />
        <br />
      </Typography>
      <Paper elevation={1}>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                required
                autoFocus
                type="email"
                id="email"
                label="Account email"
                fullWidth
                autoComplete="email"
                onChange={(e) => { setEmail(e.target.value); setHelperText(' ') }}
                helperText={helperText}
                disabled={!emailEnabled}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={submitRecoveryRequest}
                className={classes.button}
                disabled={!submitEnabled}
              >
                {'Submit Request'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}
