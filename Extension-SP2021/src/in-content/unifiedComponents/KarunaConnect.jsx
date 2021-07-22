import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityState, ValidUserState } from './data/globalState.js'

import { Container } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import ConnectStatusDrawer from './KarunaConnect/ConnectStatusDrawer.jsx'
import ConnectMainDrawer from './KarunaConnect/ConnectMainDrawer.jsx'

// Colorful logger (enable if logging is needed)
// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('CONNECT Component', 'lavender', 'black')

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  rootDiscord: {
    // AIW By switching the injected element to Container, I don't think this styling is necessary.
    // Sizing to fill the page
    // position: 'relative',
    // width: '100%',
    // height: '100%'

    // Set to be in front of all the other elements
    // zIndex: 100
  },
  rootTeams: {
    // AIW By switching the injected element to Container, I don't think this styling is necessary.
    // Sizing to fill the page
    // position: 'relative',
    // width: '100%',
    // height: '100%',

    // Ensure it is at the top of page (not the bottom)
    top: '-100vh'

    // Set to be in front of all the other elements
    // zIndex: 100

  }
}))

// The sidebar Karuna Connect object
export default function KarunaConnect (props) {
  // Deconstruct props
  const { context } = props

  // Create and deconstruct style class names
  const { rootDiscord, rootTeams } = useStyles()

  // State of user login (GLOBAL STATE)
  const userLoggedIn = useRecoilValue(ValidUserState)

  // Full state and setter for visibility of main connect panel (GLOBAL STATE)
  const [mainPanelOpen, setMainPanelOpen] = useRecoilState(ConnectVisibilityState)

  // Setter for visibility of bubble feedback (GLOBAL STATE)
  const setBubbleFeedbackOpen = useSetRecoilState(BubbleVisibilityState)

  // Ensure bubble feedback closes whenever we open the main panel
  const openMainPanel = () => {
    setBubbleFeedbackOpen(false)
    setMainPanelOpen(true)
  }

  // Main render
  return (
    <Container disableGutters className={(context === 'msTeams' ? rootTeams : rootDiscord)}>
      {userLoggedIn &&
        <ConnectStatusDrawer
          hidden={!userLoggedIn || mainPanelOpen}
          onHide={openMainPanel}
        />}
      {userLoggedIn &&
        <ConnectMainDrawer
          hidden={!mainPanelOpen}
          onHide={() => { setMainPanelOpen(false) }}
        />}
    </Container>
  )
}

KarunaConnect.propTypes = {
  context: PropTypes.string.isRequired
}
