import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import ConnectStatusPanel from './ConnectStatusPanel.jsx'
import ConnectMainPanel from './ConnectMainPanel.jsx'

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  root: {
    // Sizing to fill the page
    position: 'relative',
    width: '100%',
    height: '100%',

    // Set to be in front of all the other elements
    zIndex: 100
  }
}))

// The sidebar Karuna Connect object
export default function ConnectComponent () {
  // Deconstruct props and style class names
  const { root } = useStyles()

  // Is the mouse over this component
  const [mainPanelOpen, setMainPanelOpen] = useState(false)

  // Main render
  return (
    <div className={root}>
      <ConnectStatusPanel hidden={mainPanelOpen} onHide={() => { setMainPanelOpen(true) }} />
      <ConnectMainPanel hidden={!mainPanelOpen} onHide={() => { setMainPanelOpen(false) }} />
    </div>
  )
}

ConnectComponent.propTypes = {
}

ConnectComponent.defaultProps = {
}
