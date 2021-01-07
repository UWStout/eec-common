import React, { useState } from 'react'

import { Button } from '@material-ui/core'
import ConnectForm from './ConnectForm.jsx'

export default function ConnectComponent (props) {
  const [formOpen, updateFormOpen] = useState(false)

  const handleClick = (e) => {
    const newFormOpen = !formOpen
    updateFormOpen(newFormOpen)
  }

  return (
    <React.Fragment>
      <Button onClick={handleClick}>K</Button>
      <ConnectForm opened={formOpen} />
    </React.Fragment>
  )
}
