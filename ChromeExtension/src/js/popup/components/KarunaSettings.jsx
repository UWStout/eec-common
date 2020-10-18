import React, { Component } from 'react'

export default class KarunaSettings extends Component {


    render () {
        return (
            <div>
                <h3>Karuna Settings Content</h3>
                <div>
                    <h3>Collaboration timeout</h3>
                    <input type="text" />
                </div>
                <div>
                    <h3>Non project-related messages</h3>
                    <button>thumbs down</button>
                    <button>thumbs up</button>
                </div>
            </div>
        );
    }
}