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

// The sidebar Karuna Connect object
export default function KarunaConnect (props) {
  // Deconstruct props
  const { context } = props

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
    <Container disableGutters aria-label={'Karuna Connect Panel'}>
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
