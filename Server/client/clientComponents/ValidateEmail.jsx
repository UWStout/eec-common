import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'

import { submitValidationToken, checkToken } from '../authHelper.js'

import KarunaIcon from '../sharedComponents/KarunaIcon.jsx'

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

export default function ValidateEmail (props) {
  const { token } = props
  const classes = useStyles()

  const [validToken, setValidToken] = useState(false)
  useEffect(() => {
    setValidToken(checkToken(token))
  }, [token])

  // Track password and submit state
  const [emailValidated, setEmailValidated] = useState(false)
  const submitValidation = useCallback(async () => {
    try {
      const success = await submitValidationToken(token)
      if (success) {
        setEmailValidated(true)
      }
    } catch (err) {
      if (err?.response?.status === 429) {
        window.alert('Too many validation attempts (please wait 10 seconds)')
      } else {
        const message = (err?.response?.data?.message ? err.response.data.message : 'unknown error')
        window.alert(`Error resetting password. Please contact an administrator for help.\n\n(Info: ${message})`)
      }
    }
  }, [token])

  // Receive the new password and submit it
  useEffect(() => {
    if (validToken && !emailValidated) { submitValidation() }
  }, [validToken, submitValidation, emailValidated])

  return (
    <div className={classes.layout}>
      <div className={classes.logoStyle}>
        <KarunaIcon />
        <Typography component="h1" variant="h5">
          {'Validate Email'}
        </Typography>
      </div>
      {validToken ?
        <React.Fragment>
          <Typography variant="body1" color="textSecondary">
            {'Submitting email for validation.'}
          </Typography>
          {emailValidated &&
            <React.Fragment>
              <br />
              <Typography variant="body1" color="textSecondary">
                {'Email validated! You may now log into the Karuna extension.'}
              </Typography>
            </React.Fragment>}
        </React.Fragment> :

        // Token is missing or invalid
        <Box pt={4} pb={4} borderColor="grey.400" border={1} borderLeft={0} borderRight={0}>
          <Typography variant="body1">
            {token && 'The token provided is not valid or may be expired.'}
            {!token && 'You must provide an email validation token.'}
            <br />
            <br />
            {'Please check your email for a message from "noreply@karuna.run" with a validation link. '}
            {'NOTE: it may be in your clutter or spam folder.'}
          </Typography>
        </Box>}
    </div>
  )
}

ValidateEmail.propTypes = {
  token: PropTypes.string
}

ValidateEmail.defaultProps = {
  token: ''
}
