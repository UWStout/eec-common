import React, { Component } from 'react'
import Axios from 'axios'
import Modal from '../modal.jsx'
import Portal from '../portal.js'

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
        this.confirmRemoveTeam = this.confirmRemoveTeam.bind(this)
        this.denyRemoveTeam = this.denyRemoveTeam.bind(this)
    }

    confirmRemoveTeam() {
        this.setState({
            removeTeam: true
        })
    }

    denyRemoveTeam() {
        this.setState({
            removeTeam: false
        })
    }

    createUI() {
        return this.state.values.map((i) =>
            <div key={ i }>
                <input type='button' value='remove' onClick={ this.removeClick.bind(this, i) } />
            </div>
        )
    }

    handleChange(i, event) {
        let values = [...this.state.values];
        values[i] = event.target.value;
        this.setState({ values });
    }

    handleEmailChange (event) {
        this.setState({ email: event.target.value })
    }

    handlePasswordChange (event) {
        this.setState({ password: event.target.value })
    }

    addClick() {
        this.setState(prevState => ({ values: [...prevState.values, ''] }))
    }

    removeClick(i) {
        if (this.state.removeTeam) {
            let values = [...this.state.values];
            values.splice(i,1);
            this.setState({ 
                values,
                showModal: false,
                removeTeam: false
            })
        } else if (!this.state.removeTeam && !this.state.showModal) {
            this.setState({
                showModal: true
            })
        } else if (!this.state.removeTeam && this.state.showModal) {
            this.setState({
                showModal: false
            })
        }
    }

    async validateLogin() {
        try {
            const response = await Axios.post('http://localhost:3000/auth/login',
                { email: this.state.email, password: this.state.password }
            )
            chrome.runtime.sendMessage({
              type: 'write',
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
                    { this.createUI() }
                    <button onClick={this.addClick.bind(this)} >
                        add team
                    </button>
                    <Portal>
                        <Modal onConfirm={this.confirmRemoveTeam} onDeny={this.denyRemoveTeam} show={this.state.showModal}>
                            Are you sure?
                        </Modal>
                    </Portal>
                </div>
            </div>
        );
    }
}