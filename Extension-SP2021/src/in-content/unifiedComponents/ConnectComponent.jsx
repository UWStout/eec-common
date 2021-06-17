/* global EventEmitter3 */

import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import ConnectStatusPanel from './ConnectStatusPanel.jsx'
import ConnectMainPanel from './ConnectMainPanel.jsx'

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  rootDiscord: {
    // Sizing to fill the page
    position: 'relative',
    width: '100%',
    height: '100%',

    // Set to be in front of all the other elements
    zIndex: 100
  },
  rootTeams: {
    // Sizing to fill the page
    position: 'relative',
    width: '100%',
    height: '100%',

    // Ensure it is at the top of page (not the bottom)
    top: '-100vh',

    // Set to be in front of all the other elements
    zIndex: 100
  }
}))

// The sidebar Karuna Connect object
export default function ConnectComponent (props) {
  // Deconstruct props and style class names
  const { rootDiscord, rootTeams } = useStyles()
  const { context, emitter } = props

  // Is the mouse over this component
  const [mainPanelOpen, setMainPanelOpen] = React.useState(false)

  // Main render
  return (
    <div className={(context === 'msTeams' ? rootTeams : rootDiscord)}>
      <ConnectStatusPanel hidden={mainPanelOpen} onHide={() => { setMainPanelOpen(true) }} />
      <ConnectMainPanel hidden={!mainPanelOpen} onHide={() => { setMainPanelOpen(false) }} />
    </div>
  )
}

ConnectComponent.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3).isRequired,
  context: PropTypes.string.isRequired
}
