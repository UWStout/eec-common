import React, { Component } from 'react'
import Team from '../Team.jsx'
import Button from '@material-ui/core/Button'

export default class AccountSettings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      values: [],
      email: '',
      password: '',
      showModal: false,
      removeTeam: false
    }

    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
  }

  handleEmailChange (event) {
    this.setState({
      email: event.target.value
    })
  }

  handlePasswordChange (event) {
    this.setState({
      password: event.target.value
    })
  }

  validateLogin () {
    const message = {
      type: 'ajax-validateAccount',
      email: this.state.email,
      password: this.state.password
    }

    // Send message to background (which does the ajax request)
    chrome.runtime.sendMessage(message, (data) => {
      if (data.error) {
        window.alert('Login failed: ' + data.error.message)
        console.log(data.error)
      } else {
        window.alert('Login succeeded')
        chrome.runtime.sendMessage({ type: 'write', key: 'JWT', data: data.token })
        chrome.runtime.sendMessage({ type: 'login', key: 'JWT', data: data.token })
      }
    })
  }

  render () {
    return (
      <div>
        <div>
          <h3>Email</h3>
          <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
        </div>
        <div>
          <h3>Password</h3>
          <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          <Button onClick={() => { this.validateLogin() }}>login</Button>
        </div>
        <div>
          <h3>Current Teams</h3>
          <Team />
        </div>
      </div>
    )
  }
}
