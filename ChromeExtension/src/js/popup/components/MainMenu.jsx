import React, { Component } from 'react'
import KarunaSettings from './KarunaSettings.jsx'
import AccountSettings from './AccountSettings.jsx'
import EmojiHistory from './EmojiHistory.jsx'

export default class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            karunaSettingsClicked: false,
            accountSettingsClicked: false,
            emojiHistoryClicked: false
        }
    }

    handleKarunaClick() {
        this.setState({
            karunaSettingsClicked: true
        });
    }

    handleAccountClick() {
        this.setState({
            accountSettingsClicked: true
        });
    }

    handleEmojiHistoryClick() {
        this.setState({
            emojiHistoryClicked: true
        });
    }

    handleReturnClick() {
        this.setState({
            karunaSettingsClicked: false,
            accountSettingsClicked: false,
            emojiHistoryClicked: false
        });
    }

    render () {
        const karunaClicked = this.state.karunaSettingsClicked;
        const accountClicked = this.state.accountSettingsClicked;
        const emojiHistClicked = this.state.emojiHistoryClicked;
        let karunaSettingsMenu, accountSettingsMenu, emojiHistMenu;

        if (this.state.karunaSettingsClicked) {
            karunaSettingsMenu = <KarunaSettings />
        }
        if(this.state.accountSettingsClicked) {
            accountSettingsMenu = <AccountSettings />
        }
        if(this.state.emojiHistoryClicked) 
            emojiHistMenu = <EmojiHistory />

        return (
            <div className="mainMenu">
                <div>
                    <h3>Karuna</h3>
                    {karunaClicked || accountClicked || emojiHistClicked
                        ? <button onClick={() => this.handleReturnClick()}>back</button>
                        : null
                    }
                    <button>X</button>
                </div>
                {!karunaClicked && !accountClicked && !emojiHistClicked ?
                <div>
                    <div>
                        <h5>Current Mood</h5>
                        <button>thumbs up</button>
                        <button>thumbs down</button>
                    </div>
                    <div>
                        <h5>Emoji History</h5>
                        <button onClick={() => this.handleEmojiHistoryClick()}>:)O</button>
                    </div>
                    <div>
                        <h5>Karuna Settings</h5>
                        <button onClick={() => this.handleKarunaClick()}>gear</button>
                    </div>
                    <div>
                        <h5>Account Settings</h5>
                        <button onClick={() => this.handleAccountClick()}>:)</button>
                    </div>
                </div>
                : karunaSettingsMenu || accountSettingsMenu || emojiHistMenu
                }
            </div>
        );
    }
}