import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import ConnectForm from './ConnectForm.jsx'

// The sidebar Karuna Connect object
export default function ConnectComponent (props) {
  const [formOpen, updateFormOpen] = useState(false)
  const [historyFormOpen, updateHistoryFormOpen] = useState(false)

  // Opens and closes main menu
  const handleClick = (e) => {
    const newFormOpen = !formOpen
    updateFormOpen(newFormOpen)
  }

  // Tracks history panel opening for button display
  const handleHistoryClick = (e) => {
    const newHistoryFormOpen = !historyFormOpen
    updateHistoryFormOpen(newHistoryFormOpen)
  }

  // Tracks state of each panel and displays karuna button if neither panel is open
  const PanelOpenButton = !formOpen && !historyFormOpen ? <Button onClick={handleClick}>K</Button> : null

  return (
    <React.Fragment>
      {PanelOpenButton}
      <ConnectForm opened={formOpen} handleClose={handleClick} handleHistoryFormOpen={handleHistoryClick} />
    </React.Fragment>
  )
}
