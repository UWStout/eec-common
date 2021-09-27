/* global EventEmitter3 */

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { MessagingContextState, TextBoxListState, TypeToActiveInputState } from './data/globalSate/appState.js'
import { TeammateStatusUpdateState } from './data/globalSate/teamState.js'
import { LoggedInUserState, AliasListState } from './data/globalSate/userState.js'

import { CssBaseline } from '@material-ui/core'

import * as HELPER from './data/backgroundHelper.js'

import KarunaConnect from './KarunaConnect.jsx'
import KarunaBubble from './KarunaBubble.jsx'
import KarunaTextBoxManager from './KarunaTextBoxManager.jsx'

// Colorful logger (enable if logging is needed)
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('UNIFIED React App', 'lavender', 'black')

// The sidebar Karuna Connect object
export default function UnifiedApp (props) {
  // De-construct props
  const { emitter, context } = props

  // Track messaging context globally
  const setMessagingContext = useSetRecoilState(MessagingContextState)
  useEffect(() => {
    setMessagingContext(context)
  }, [setMessagingContext, context])

  // Track logged in state globally
  const setLoggedInUserState = useSetRecoilState(LoggedInUserState)
  useEffect(() => {
    // When a login occurs, update basic user info
    emitter.on('login', async () => {
      const userInfo = await HELPER.retrieveBasicUserInfo()
      setLoggedInUserState(userInfo)
    })

    // Clear user info on a logout
    emitter.on('logout', () => {
      setLoggedInUserState({})
    })
  }, [emitter, setLoggedInUserState])

  // Track user status updates globally
  const setTeammateStatusUpdate = useSetRecoilState(TeammateStatusUpdateState)
  useEffect(() => {
    emitter.on('teammateStatusUpdate', (newUserStatus) => {
      LOG('Teammate status updated:', newUserStatus)
      setTeammateStatusUpdate()
    })
  }, [emitter, setTeammateStatusUpdate])

  // Process JIT Status data
  useEffect(() => {
    emitter.on('statusMessage', (message) => {
      LOG('Status Message Received:', message)
    })
  }, [emitter])

  // Capture tunneled keys
  const typeToActiveInput = useSetRecoilState(TypeToActiveInputState)
  useEffect(() => {
    emitter.on('tunnel-key', (keyEvent) => {
      if (keyEvent.type === 'keydown') {
        typeToActiveInput(keyEvent.key)
      }
    })
  }, [emitter, typeToActiveInput])

  // Track logged in state globally
  const setTextBoxList = useSetRecoilState(TextBoxListState)
  useEffect(() => {
    emitter.on('updateTextBoxes', setTextBoxList)
  }, [emitter, setTextBoxList])

  // Track alias list state globally
  const setAliasList = useSetRecoilState(AliasListState)
  useEffect(() => {
    emitter.on('aliasListChanged', (aliasList) => {
      setAliasList(aliasList)
    })
  }, [emitter, setAliasList])

  return (
    <React.Fragment>
      <CssBaseline />
      <KarunaConnect />
      <KarunaBubble emitter={emitter} />
      <KarunaTextBoxManager emitter={emitter} />
    </React.Fragment>
  )
}

UnifiedApp.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3),
  context: PropTypes.string
}

UnifiedApp.defaultProps = {
  emitter: null,
  context: 'unknown'
}
