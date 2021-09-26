import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState } from 'recoil'
import { PasswordState } from './globalData.js'

import { Typography, Grid, TextField } from '@material-ui/core'

import { validatePassword } from '../passwordHelper.js'

export default function PasswordForm (props) {
  // De-construct props
  const { setNextStepEnabled, showAsReset, disableInput } = props

  // Text box state
  const [newPassword, setNewPassword] = useRecoilState(PasswordState)
  const [confirmPassword, setConfirmPassword] = useState('')

  // Analyze password
  const [strength, strengthMessage] = validatePassword(newPassword)
  const passwordsMatch = (newPassword === confirmPassword)

  // Synchronize next step enabled with form validation
  useEffect(() => {
    if (setNextStepEnabled) {
      setNextStepEnabled(strength > 50 && passwordsMatch, newPassword)
    }
  }, [newPassword, passwordsMatch, setNextStepEnabled, strength])

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {`Account Password${showAsReset && ' Reset'}`}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TextField
            required
            autoFocus
            type="password"
            id="newPassword"
            label="New Password"
            fullWidth
            autoComplete="new-password"
            error={strengthMessage !== ''}
            helperText={strengthMessage !== '' ? strengthMessage : ' '}
            onChange={(e) => { setNewPassword(e.target.value) }}
            disabled={disableInput}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            required
            type="password"
            id="confirmPassword"
            label="Confirm Password"
            fullWidth
            autoComplete="new-password"
            error={!passwordsMatch}
            helperText={passwordsMatch ? ' ' : 'Passwords do not match'}
            onChange={(e) => { setConfirmPassword(e.target.value) }}
            disabled={disableInput}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

PasswordForm.propTypes = {
  setNextStepEnabled: PropTypes.func,
  showAsReset: PropTypes.bool,
  disableInput: PropTypes.bool
}

PasswordForm.defaultProps = {
  setNextStepEnabled: null,
  showAsReset: false,
  disableInput: false
}
