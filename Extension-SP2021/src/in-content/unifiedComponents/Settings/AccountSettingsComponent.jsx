import React, { useState, useEffect } from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { LoggedInUserState } from '../data/globalSate/userState'
import { PushConnectActivityState } from '../data/globalSate/connectActivityState'

import { Grid, TextField, Button } from '@material-ui/core'

import ExternalLink from '../Shared/ExternalLink.jsx'

import { checkUserEmail, updateBasicUserInfo } from '../data/backgroundHelper'
import * as SERVER from '../../../util/serverConfig.js'
import { ACTIVITIES } from '../KarunaConnect/Activities/Activities'

import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('Account Settings Activity', 'navy', 'white')

// Simple regex for validating emails (not foolproof)
export const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/

export default function AccountSettingsComponent (props) {
  // Read user info from Global recoil state
  const accountInfo = useRecoilValue(LoggedInUserState)

  // Global connect activity state
  const pushConnectActivity = useSetRecoilState(PushConnectActivityState)

  // Text box state
  const [fullName, setFullName] = useState(accountInfo.name)
  const [preferredPronouns, setPreferredPronouns] = useState(accountInfo.preferredPronouns)
  const [preferredName, setPreferredName] = useState(accountInfo.preferredName)
  const [email, setEmail] = useState(accountInfo.email)
  const [emailErrorMsg, setEmailErrorMsg] = useState('')

  // Email encoded as a URI
  const emailURIComp = encodeURIComponent(accountInfo.email)

  // Check for any email error states
  useEffect(() => {
    if (!email.match(EMAIL_REGEX)) {
      setEmailErrorMsg('A valid email is required')
    }
  }, [email])

  // Function to save changes to the database
  const onSaveChanges = async () => {
    // Check if email is changed
    if (email.toLowerCase() !== accountInfo.email.toLowerCase()) {
      // Ensure email not already in use
      try {
        await checkUserEmail(email)
      } catch (err) {
        LOG('Bad email', err)
        setEmailErrorMsg('Email already in use')
        return
      }
    }

    // Try to update all basic user info
    try {
      await updateBasicUserInfo({ name: fullName, preferredName, preferredPronouns, email })
    } catch (err) {
      alert('Error updating user info (see console for details).')
      LOG('Failed to update user info', err)
      return
    }

    // Success so show confirmation
    pushConnectActivity(ACTIVITIES.ACCOUNT_SETTINGS_CONFIRM.key)
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          id="fullName"
          name="fullName"
          label="Name"
          fullWidth
          autoComplete="name"
          helperText="Edit your legal/full name"
          value={fullName}
          onChange={(e) => { setFullName(e.target.value) }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="preferredName"
          name="preferredName"
          label="Preferred name"
          fullWidth
          autoComplete="nickname"
          helperText="Edit your preferred name"
          value={preferredName}
          onChange={(e) => { setPreferredName(e.target.value) }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="preferredPronouns"
          name="preferredPronouns"
          label="Preferred pronouns"
          fullWidth
          autoComplete="pronouns"
          helperText="Edit your pronouns"
          value={preferredPronouns}
          onChange={(e) => { setPreferredPronouns(e.target.value) }}
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
          helperText={emailErrorMsg === '' ? 'Edit your accountEmail' : emailErrorMsg}
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
          error={emailErrorMsg !== ''}
        />
      </Grid>

      <Grid item xs={12}>
        <ExternalLink href={`https://${SERVER.HOST_NAME}/${SERVER.ROOT}Recovery.html?email=${emailURIComp}`}>
          {'Change Password'}
        </ExternalLink>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={onSaveChanges}>
          {'Save Changes'}
        </Button>
      </Grid>
    </Grid>
  )
}
