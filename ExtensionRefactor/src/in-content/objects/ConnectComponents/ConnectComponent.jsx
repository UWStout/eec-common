import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import ConnectForm from './ConnectForm.jsx'

export default function ConnectComponent (props) {
  const [formOpen, updateFormOpen] = useState(false)
  const [historyFormOpen, updateHistoryFormOpen] = useState(false)

  const handleClick = (e) => {
    const newFormOpen = !formOpen
    updateFormOpen(newFormOpen)
  }

  const handleHistoryClick = (e) => {
    const newHistoryFormOpen = !historyFormOpen
    updateHistoryFormOpen(newHistoryFormOpen)
  }

  const PanelOpenButton = !formOpen && !historyFormOpen ? <Button onClick={handleClick}>K</Button> : null

  return (
    <React.Fragment>
      {PanelOpenButton}
      <ConnectForm opened={formOpen} handleClose={handleClick} handleHistoryFormOpen={handleHistoryClick} />
    </React.Fragment>
  )
}
