import React, { Component } from 'react'
import KarunaSettings from './KarunaSettings.jsx'
import AccountSettings from './AccountSettings.jsx'
import Button from '@material-ui/core/Button'
import '../CSS/Menu.css'

export default class MainMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            karunaSettingsClicked: false,
            accountSettingsClicked: false
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

    handleReturnClick() {
        this.setState({
            karunaSettingsClicked: false,
            accountSettingsClicked: false
        });
    }

    render () {
        const karunaClicked = this.state.karunaSettingsClicked;
        const accountClicked = this.state.accountSettingsClicked;
        let karunaSettingsMenu, accountSettingsMenu;

        if (this.state.karunaSettingsClicked) {
            karunaSettingsMenu = <KarunaSettings />
        }
        if(this.state.accountSettingsClicked) {
            accountSettingsMenu = <AccountSettings />
        }

        return (
            <div id="mainMenu">
                <div>
                    <ul id="karunaHead">
                        {karunaClicked || accountClicked
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
                {!karunaClicked && !accountClicked ?
                <div>
                    <div>
                        <h3>Karuna Settings</h3>
                        <Button onClick={() => this.handleKarunaClick()}>gear</Button>
                    </div>
                    <div>
                        <h3>Account Settings</h3>
                        <Button onClick={() => this.handleAccountClick()}>:)</Button>
                    </div>
                </div>
                : karunaSettingsMenu || accountSettingsMenu
                }
            </div>
        );
    }
}