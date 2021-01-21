import React, { useState } from 'react'

import KarunaSettings from './KarunaSettings.jsx'
import AccountSettings from './AccountSettings.jsx'

import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CloseIcon from '@material-ui/icons/Close'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
  karunaHead: {
    color: 'black',
    borderBottom: '3px solid rgb(88, 85, 85)',
    display: 'inline',
    padding: '0px 10px 10px 10px',
    listStyleType: 'none',
    textAlign: 'center',
  },

  karunaHeadLi: {
    display: 'inline-block',
    padding: '12px'
  },

  karunaTitle: {
    backgroundColor: 'white'
  },

  karunaMenuUl: {
    listStyleType: 'none'
  },

  mainMenu: {
    width: '240px'
  }
})

// Component for the root main-menu of Karuna settings
export default function mainMenu () {
  // Prepare CSS styles
  const classes = useStyles()

  // Prepare state
  const [karunaClicked, updateKarunaClicked] = useState(false)
  const [accountClicked, updateAccountClicked] = useState(false)

  // Build sub-menu if needed
  const karunaMenu = (karunaClicked ? <KarunaSettings /> : undefined)
  const accountMenu = (accountClicked ? <AccountSettings /> : undefined)

  // Create callback functions
  const handleKarunaClick = () => { updateKarunaClicked(true) }
  const handleAccountClick = () => { updateAccountClicked(true) }
  const handleReturnClick = () => {
    updateKarunaClicked(false)
    updateAccountClicked(false)
  }

  // Return proper state of menu
  return (
    <div className={classes.mainMenu}>
      <div>
        <ul id="karunaHead" className={classes.karunaHead}>
          { karunaClicked || accountClicked ?
            <li className={classes.karunaHeadLi}>
              <IconButton id="returnButton" onClick={handleReturnClick}><ArrowBackIcon /></IconButton>
            </li>
            : null }
          <li className={classes.karunaHeadLi}><h3 id="karunaTitle" className={classes.karunaTitle}>Karuna</h3></li>
          <li className={classes.karunaHeadLi}><IconButton id="returnButton" onClick={window.close}><CloseIcon /></IconButton></li>
        </ul>
      </div>
      { !karunaClicked && !accountClicked ?
        <div>
          <div>
            <span>
              <IconButton onClick={handleAccountClick}>
                <AccountCircleIcon />
              </IconButton>
              Account Settings
            </span>
          </div>
          <div>
            <span>
              <IconButton onClick={handleKarunaClick}>
                <SettingsIcon />
              </IconButton>
              Karuna Settings
            </span>
          </div>
        </div>
        : karunaMenu || accountMenu }
    </div>
  )
}
