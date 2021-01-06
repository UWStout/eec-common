import React, { useState } from 'react'
import Team from '../Team.jsx'
import Button from '@material-ui/core/Button'

export default function AccountSettings () {
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
    <div>
      <div>
        <h3>Email</h3>
        <input type="text" value={email} onChange={(e) => updateEmail(e.target.value)} />
      </div>
      <div>
        <h3>Password</h3>
        <input type="password" value={password} onChange={(e) => updatePassword(e.target.value)} />
        <Button onClick={validateLogin}>login</Button>
      </div>
      <div>
        <h3>Current Teams</h3>
        <Team />
      </div>
    </div>
  )
}
