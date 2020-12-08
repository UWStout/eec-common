import React, { Component } from 'react'
import KarunaSettings from './KarunaSettings.jsx'
import AccountSettings from './AccountSettings.jsx'
import EmojiHistory from './EmojiHistory.jsx'
import Button from '@material-ui/core/Button'
import '../CSS/Menu.css'

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
            <div id="mainMenu">
                <div>
                    <ul id="karunaHead">
                        {karunaClicked || accountClicked || emojiHistClicked
                            ? <li>
                                <Button 
                                    id="returnButton" 
                                    onClick={() => this.handleReturnClick()}
                                >
                                    back
                                </Button>
                            </li>
                            : null
                        }
                        <li><h3 id="karunaTitle">Karuna</h3></li>
                        <li><Button id="returnButton">X</Button></li>
                    </ul>
                </div>
                {!karunaClicked && !accountClicked && !emojiHistClicked ?
                <div>
                    <div>
                        <h3>Current Mood</h3>
                        <Button>thumbs up</Button>
                        <Button>thumbs down</Button>
                    </div>
                    <div>
                        <h3>Emoji History</h3>
                        <Button onClick={() => this.handleEmojiHistoryClick()}>:)O</Button>
                    </div>
                    <div>
                        <h3>Karuna Settings</h3>
                        <Button onClick={() => this.handleKarunaClick()}>gear</Button>
                    </div>
                    <div>
                        <h3>Account Settings</h3>
                        <Button onClick={() => this.handleAccountClick()}>:)</Button>
                    </div>
                </div>
                : karunaSettingsMenu || accountSettingsMenu || emojiHistMenu
                }
            </div>
        );
    }
}