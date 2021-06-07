import React, { useState } from 'react'

import KarunaSettings from './KarunaSettings.jsx'
import AccountSettings from './AccountSettings.jsx'
import AdminSettings from './AdminSettings.jsx'

import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CloseIcon from '@material-ui/icons/Close'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const useStyles = makeStyles({
  karunaHead: {
    color: 'black',
    borderBottom: '3px solid rgb(88, 85, 85)',
    display: 'inline',
    padding: '0px 10px 10px 10px',
    listStyleType: 'none',
    textAlign: 'center'
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
  const [adminClicked, updateAdminClicked] = useState(false)

  // Build sub-menu if needed
  const karunaMenu = (karunaClicked ? <KarunaSettings /> : undefined)
  const accountMenu = (accountClicked ? <AccountSettings /> : undefined)
  const adminMenu = (adminClicked ? <AdminSettings /> : undefined)

  // Create callback functions
  const handleKarunaClick = () => { updateKarunaClicked(true) }
  const handleAccountClick = () => { updateAccountClicked(true) }
  // TODO: Add logic to check for account admin privileges and only display admin settings when true
  const handleAdminClick = () => { updateAdminClicked(true) }
  const handleReturnClick = () => {
    updateKarunaClicked(false)
    updateAccountClicked(false)
    updateAdminClicked(false)
  }

  // Return proper state of menu
  return (
    <div className={classes.mainMenu}>
      <div>
        <ul id="karunaHead" className={classes.karunaHead}>
          { karunaClicked || accountClicked || adminClicked
            ? <li className={classes.karunaHeadLi}>
              <IconButton id="returnButton" onClick={handleReturnClick}><ArrowBackIcon /></IconButton>
            </li>
            : null }
          <li className={classes.karunaHeadLi}><h3 id="karunaTitle" className={classes.karunaTitle}>Karuna</h3></li>
          <li className={classes.karunaHeadLi}><IconButton id="returnButton" onClick={window.close}><CloseIcon /></IconButton></li>
        </ul>
      </div>
      { !karunaClicked && !accountClicked && !adminClicked
        ? <div>
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
          <div>
            <span>
              <IconButton onClick={handleAdminClick}>
                <SettingsIcon />
              </IconButton>
              Admin Settings
            </span>
          </div>
        </div>
        : karunaMenu || accountMenu || adminMenu}
    </div>
  )
}
