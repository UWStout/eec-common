import React, { Component } from 'react'

export default class AccountSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: []
        }
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

    addClick() {
        this.setState(prevState => ({ values: [...prevState.values, '']}))
    }

    removeClick(i) {
        let values = [...this.state.values];
        values.splice(i,1);
        this.setState({ values });
    }

    render () {
        return (
            <div>
                <div>
                    <h3>Email</h3>
                    <input type="text" />
                </div>
                <div>
                    <h3>Password</h3>
                    <input type="text" />
                    <button>reset</button>
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