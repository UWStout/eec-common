import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useRecoilState } from 'recoil'
import { FullNameState, PreferredNameState, PreferredPronounsState, EmailState } from '../globalData'

import { Grid, Typography, TextField } from '@material-ui/core'

// Simple regex for validating emails (not foolproof)
const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/

export default function AccountInfoForm (props) {
  // De-construct props
  const { setNextStepEnabled } = props

  // Text box state
  const [fullName, setFullName] = useRecoilState(FullNameState)
  const [preferredPronouns, setPreferredPronouns] = useRecoilState(PreferredPronounsState)
  const [preferredName, setPreferredName] = useRecoilState(PreferredNameState)
  const [email, setEmail] = useRecoilState(EmailState)

  // Check any error states
  const emailErrorMsg = ((email === '' || email.match(EMAIL_REGEX)) ? '' : 'A valid email is required')

  // Synchronize next step enabled with form validation
  useEffect(() => {
    if (setNextStepEnabled) {
      setNextStepEnabled(fullName !== '' && preferredName !== '' && email.match(EMAIL_REGEX))
    }
  }, [email, fullName, preferredName, setNextStepEnabled])

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {'Account Personal Info'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="fullName"
            name="fullName"
            label="Full Name"
            fullWidth
            autoComplete="name"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="preferredPronouns"
            name="preferredPronouns"
            label="Preferred pronouns"
            fullWidth
            autoComplete="pronouns"
            value={preferredPronouns}
            onChange={(e) => { setPreferredPronouns(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="preferredName"
            name="preferredName"
            label="Preferred name"
            fullWidth
            autoComplete="nickname"
            value={preferredName}
            onChange={(e) => { setPreferredName(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            error={emailErrorMsg !== ''}
            helperText={emailErrorMsg === '' ? ' ' : emailErrorMsg}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

AccountInfoForm.propTypes = {
  setNextStepEnabled: PropTypes.func
}

AccountInfoForm.defaultProps = {
  setNextStepEnabled: null
}
