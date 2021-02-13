import React, { useState } from 'react'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import Team from '../Team.jsx'
import { backgroundMessage } from '../../../in-content/objects/AJAXHelper.js'

const useStyles = makeStyles({
  AccountSettingsBody: {
    padding: '5px 0px 5px 0px'
  }
})

export default function AccountSettings () {
  const classes = useStyles()
  const [email, updateEmail] = useState('')
  const [password, updatePassword] = useState('')
  const [loggedIn, updateLoggedIn] = useState(false)

  // Read the JWT for later use
  chrome.runtime.sendMessage(
    { type: 'read', key: 'JWT' },
    (response) => {
      this.JWT = response.value
      updateLoggedIn(true)
    }
  )

  // Decode JWT payload (without verification)
  function decodeTokenPayload (token) {
    // Validate that token has a payload
    if (typeof token !== 'string' || token.split('.').length < 2) {
      return {}
    }
    // Decode the JWT payload only
    return JSON.parse(atob(token.split('.')[1]))
  }

  const payload = decodeTokenPayload(this.JWT)

  // Login validation callback
  const validateLogin = () => {
    // Message payload
    const message = {
      type: 'ajax-validateAccount',
      email: email,
      password: password
    }

    // Saves the JWT and logs the user in.
    function login (data) {
      // Store the token and broadcast a successful login
      chrome.runtime.sendMessage({ type: 'write', key: 'JWT', data: data.token })
      chrome.runtime.sendMessage({ type: 'login', key: 'JWT', data: data.token })
      updateLoggedIn(true)
    }

    // Send message to background (which does the ajax request)
    backgroundMessage(message, 'Invalid Login: ', login)
  }

  const logout = () => {
    chrome.runtime.sendMessage({ type: 'logout' })
    updateLoggedIn(false)
  }

  const loginDetails = (
    <div>
      <div className={classes.AccountSettingsBody}>
        <span>
          <MailOutlineIcon />
          Email
        </span>
        <div>
          <input type="text" value={email} onChange={(e) => updateEmail(e.target.value)} />
        </div>
      </div>
      <div className={classes.AccountSettingsBody}>
        <span>
          <LockOutlinedIcon />
          Password
        </span>
        <div>
          <input type="password" value={password} onChange={(e) => updatePassword(e.target.value)} />
        </div>
        <Button onClick={validateLogin}>login</Button>
      </div>
    </div>
  )

  const loggedInWelcome = (
    <div>
      <h1>Welcome {payload.firstName}</h1>
      <Button onClick={logout}>Logout</Button>
    </div>
  )

  // Build the account settings form
  return (
    <div >
      { loggedIn ? loggedInWelcome : loginDetails }
      <div>
        <span>
          <GroupOutlinedIcon />
          Current Teams
        </span>
        <Team />
      </div>
    </div>
  )
}
