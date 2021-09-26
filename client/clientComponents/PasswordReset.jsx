import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { RecoilRoot } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Link, Typography, Box, Paper } from '@material-ui/core'

import { resetAccountPassword, checkToken } from '../authHelper.js'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'
import PasswordForm from './PasswordForm.jsx'

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

export default function PasswordReset (props) {
  const { token } = props
  const classes = useStyles()

  const [validToken, setValidToken] = useState(false)
  useEffect(() => {
    setValidToken(checkToken(token))
  }, [token])

  // Track password and submit state
  const [password, setPassword] = useState('')
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const [disableInput, setDisableInput] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const passwordReady = (enable, newPassword) => {
    setSubmitEnabled(enable)
    setPassword(newPassword)
  }

  // Receive the new password and submit it
  const submitNewPassword = async () => {
    setDisableInput(true)
    setSubmitEnabled(false)
    try {
      // Try to create new user
      const success = await resetAccountPassword(token, password)
      setPasswordChanged(success)
      setDisableInput(false)
    } catch (err) {
      if (err?.response?.status === 429) {
        window.alert('Too many reset attempts (please wait 10 seconds)')
      } else {
        const message = (err?.response?.data?.message ? err.response.data.message : 'unknown error')
        window.alert(`Error resetting password. Please contact an administrator for help.\n\n(Info: ${message})`)
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
      { passwordChanged ?
        <Typography variant="body1">
          {'Password was changed. Please try logging in again.'}
        </Typography> :

        // Is the token valid
        validToken ?
          <React.Fragment>
            <Typography variant="body1">
              {'Please use the form below to set a new password.'}
              <br />
              <br />
            </Typography>
            <RecoilRoot>
              <Paper elevation={1}>
                <Box p={3}>
                  <PasswordForm showAsReset setNextStepEnabled={passwordReady} disableInput={disableInput} />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitNewPassword}
                    className={classes.button}
                    disabled={!submitEnabled}
                  >
                    {'Submit New Password'}
                  </Button>
                </Box>
              </Paper>
            </RecoilRoot>
          </React.Fragment> :

          // Token is missing or invalid
          <Box pt={4} pb={4} borderColor="grey.400" border={1} borderLeft={0} borderRight={0}>
            <Typography variant="body1">
              {token && 'The token provided is not valid or may be expired.'}
              {!token && 'You must generate a recovery token first.'}
              <br />
              <br />
              {'Please visit '}
              <Link underline="always" href="/Recovery.html">{'this page'}</Link>
              {' and follow the instructions. Click on the link in the email '}
              {'it sends you to try again.'}
            </Typography>
          </Box>}
    </div>
  )
}

PasswordReset.propTypes = {
  token: PropTypes.string
}

PasswordReset.defaultProps = {
  token: ''
}
