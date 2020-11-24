import React, { Component } from 'react'
import Team from '../Team.jsx'
import Axios from 'axios'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

export default class AccountSettings extends Component {
    constructor(props) {
        super(props);

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
        this.setState({ email: event.target.value })
    }

    handlePasswordChange (event) {
        this.setState({ password: event.target.value })
    }

    async validateLogin () {
        try {
            const response = await Axios.post('http://localhost:3000/auth/login',
                { email: this.state.email, password: this.state.password }
            )
            chrome.runtime.sendMessage({
              type: 'write',
              key: 'JWT',
              data: response.data.token
            })
            chrome.runtime.sendMessage({
              type: 'login',
              key: 'JWT',
              data: response.data.token
            })
        } catch (error) {
            window.alert(error.toString())
            console.log(error)
        }
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
                    <button onClick={() => { this.validateLogin() }}>login</button>
                </div>
                <div>
                    <h3>Current Teams</h3>
                    <Team />
                </div>
            </div>
        );
    }
}