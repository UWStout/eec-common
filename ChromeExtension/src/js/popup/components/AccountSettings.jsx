import React, { Component } from 'react'
import Axios from 'axios'

export default class AccountSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: [],
            email: '',
            password: ''
        }

        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
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
        this.setState(prevState => ({ values: [...prevState.values, '']}))
    }

    removeClick(i) {
        let values = [...this.state.values];
        values.splice(i,1);
        this.setState({ values });
    }

    async validateLogin() {
        try {
            const data = await Axios.post('http://localhost:3000/auth/login',
                { email: this.state.email, password: this.state.password }
            )
            window.alert('Success')
            console.log(data)
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
                    <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
                    <button onClick={() => { this.validateLogin() }}>login</button>
                </div>
                <div>
                    <h3>Current Teams</h3>
                    { this.createUI() }
                    <input type='button' value='add team' onClick={this.addClick.bind(this)} />
                </div>
            </div>
        );
    }
}