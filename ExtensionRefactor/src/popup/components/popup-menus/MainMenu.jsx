import React, { useState } from 'react'

import KarunaSettings from './KarunaSettings.jsx'
import AccountSettings from './AccountSettings.jsx'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
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
    padding: '20px'
  },

  karunaTitle: {
    backgroundColor: 'white'
  },

  karunaMenuUl: {
    listStyleType: 'none'
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
    <div id="mainMenu">
      <div>
        <ul id="karunaHead" className={classes.karunaHead}>
          { karunaClicked || accountClicked ?
            <li className={classes.karunaHeadLi}>
              <Button id="returnButton" onClick={handleReturnClick}>back</Button>
            </li>
            : null }
          <li className={classes.karunaHeadLi}><h3 id="karunaTitle" className={classes.karunaTitle}>Karuna</h3></li>
          <li className={classes.karunaHeadLi}><Button id="returnButton">X</Button></li>
        </ul>
      </div>
      { !karunaClicked && !accountClicked ?
        <div>
          <div>
            <h3>Karuna Settings</h3>
            <Button onClick={handleKarunaClick}>gear</Button>
          </div>
          <div>
            <h3>Account Settings</h3>
            <Button onClick={handleAccountClick}> : ) </Button>
          </div>
        </div>
        : karunaMenu || accountMenu }
    </div>
  )
}
