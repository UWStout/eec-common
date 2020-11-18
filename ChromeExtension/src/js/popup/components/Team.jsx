import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import './CSS/Menu.css'

export default class Team extends Component {
    constructor(props) {
        super(props)

        this.state = ({
            team: [],
            teamName: ''
        })

        this.removeTeam = this.removeTeam.bind(this)
    }

    addTeam(e) {
        e.preventDefault();
        this.setState({
            team: [ this.state.teamName, ...this.state.team ],
            teamName: ''
        })
    }

    updateValue(e) {
        this.setState({ teamName: [e.target.value] })
    }

    removeTeam(index) {
        const team = this.state.team.filter((team, teamIndex) => {
            return teamIndex !== index
        })
        this.setState({ team })
    }

    render() {
        return (
            <div>
                <form onSubmit = {(e) => this.addTeam(e)}>
                    <input 
                        placeholder = 'Add Team'
                        value = {this.state.teamName}
                        onChange = {(e) => {this.updateValue(e)}}
                    />
                    <button type="submit">Add Team</button>
                </form>
                <TeamList team={this.state.team} removeTeam={this.removeTeam} />
            </div>
        )
    }
}

class TeamList extends Component {
    render() {
        return (
            <ul>
                { this.props.team.map((team, index) => {
                    return  <li  key={ team } >
                                { team }
                                <button onClick = { () => this.props.removeTeam(index) }>remove</button>
                            </li>
                })}
            </ul>
        )
    }
}