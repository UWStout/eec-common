import React, { Suspense, useEffect } from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectVisibilityState, BubbleVisibilityState, ValidUserState, ActivityStackState } from './data/globalSate/appState.js'

import { Container } from '@material-ui/core'

import ConnectStatusDrawer from './KarunaConnect/ConnectStatusDrawer.jsx'
import StatusDrawerSkeleton from './KarunaConnect/StatusDrawerSkeleton.jsx'
import ConnectMainDrawer from './KarunaConnect/ConnectMainDrawer.jsx'
import { ACTIVITIES } from './Activities/Activities.js'

// Colorful logger (enable if logging is needed)
// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('CONNECT Component', 'lavender', 'black')

// The sidebar Karuna Connect object
export default function KarunaConnect (props) {
  // State of user login (GLOBAL STATE)
  const userLoggedIn = useRecoilValue(ValidUserState)

  // Full state and setter for visibility of main connect panel (GLOBAL STATE)
  const [mainPanelOpen, setMainPanelOpen] = useRecoilState(ConnectVisibilityState)

  // Setter for visibility of bubble feedback (GLOBAL STATE)
  const setBubbleFeedbackOpen = useSetRecoilState(BubbleVisibilityState)

  // Setter for the activity stack
  const setActivityStack = useSetRecoilState(ActivityStackState)

  // Setter for the active teams
  // const setActiveTeamID = useSetRecoilState(ActiveTeamIDState)

  // Ensure bubble feedback closes whenever we open the main panel
  const openMainPanel = () => {
    setBubbleFeedbackOpen(false)
    setMainPanelOpen(true)
  }

  // Whenever logged-in state changes, re-write activity stack
  useEffect(() => {
    if (userLoggedIn) {
      setActivityStack([ACTIVITIES.MAIN.key])
    } else {
      setActivityStack([ACTIVITIES.LOGIN.key])
    }
  }, [userLoggedIn, setActivityStack, setMainPanelOpen])

  // DEBUG: Default to a known team for now
  // useEffect(() => {
  //   if (userLoggedIn) {
  //     setActiveTeamID('610f02d6345079e794032eb8')
  //   }
  // }, [setActiveTeamID, userLoggedIn])

  // Main render
  return (
    <Container disableGutters aria-label={'Karuna Connect Panel'}>
      <Suspense fallback={<StatusDrawerSkeleton />}>
        {userLoggedIn &&
          <ConnectStatusDrawer
            hidden={!userLoggedIn || mainPanelOpen}
            onHide={openMainPanel}
          />}
        <ConnectMainDrawer
          hidden={!mainPanelOpen}
          onHide={() => { setMainPanelOpen(false) }}
        />
      </Suspense>
    </Container>
  )
}
