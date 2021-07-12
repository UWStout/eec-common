import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityState, ValidUserState } from './data/globalState.js'

import { makeStyles } from '@material-ui/core/styles'

import ConnectStatusPanel from './KarunaConnect/ConnectStatusPanel.jsx'
import ConnectMainPanel from './KarunaConnect/ConnectMainPanel.jsx'

// Colorful logger
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('CONNECT Component', 'lavender', 'black')

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  rootDiscord: {
    // Sizing to fill the page
    position: 'relative',
    width: '100%',
    height: '100%'

    // Set to be in front of all the other elements
    // zIndex: 100
  },
  rootTeams: {
    // Sizing to fill the page
    position: 'relative',
    width: '100%',
    height: '100%',

    // Ensure it is at the top of page (not the bottom)
    top: '-100vh'

    // Set to be in front of all the other elements
    // zIndex: 100

  }
}))

// The sidebar Karuna Connect object
export default function KarunaConnect (props) {
  // Deconstruct props
  const { context, ...restProps } = props

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
    <div>
      <div className={(context === 'msTeams' ? rootTeams : rootDiscord)}>
        <ConnectStatusPanel
          hidden={!userLoggedIn || mainPanelOpen}
          onHide={openMainPanel}
          currentStatus={restProps.currentStatus}
          affectPrivacy={restProps.affectPrivacy}
        />
        <ConnectMainPanel
          hidden={!mainPanelOpen}
          onHide={() => { setMainPanelOpen(false) }}
          {...restProps}
        />
      </div>
    </div>
  )
}

KarunaConnect.propTypes = {
  context: PropTypes.string.isRequired
}
