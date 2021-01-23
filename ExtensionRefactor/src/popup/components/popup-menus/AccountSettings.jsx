import React, { useState } from 'react'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined'

import { makeStyles } from '@material-ui/core/styles'

import Team from '../Team.jsx'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles({
  AccountSettingsBody: {
    padding: '5px 0px 5px 0px'
  },
})

export default function AccountSettings () {
  const classes = useStyles()
  // Create tracking state
  const [email, updateEmail] = useState('')
  const [password, updatePassword] = useState('')

  // Login validation callback
  const validateLogin = () => {
    // Message payload
    const message = {
      type: 'ajax-validateAccount',
      email: email,
      password: password
    }

    // Send message to background (which does the ajax request)
    chrome.runtime.sendMessage(message, (data) => {
      // Did an error occur
      if (data.error) {
        // Alert user and log error
        window.alert('Login failed: ' + data.error.message)
        console.log(data.error)
      } else {
        // Alert user
        window.alert('Login succeeded')

        // Store the token and broadcast a successful login
        chrome.runtime.sendMessage({ type: 'write', key: 'JWT', data: data.token })
        chrome.runtime.sendMessage({ type: 'login', key: 'JWT', data: data.token })
      }
    })
  }

  // Build the account settings form
  return (
    <div >
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
