/* global EventEmitter3 */

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { KarunaMessageState, LoggedInUserState } from './data/globalState.js'

import { CssBaseline } from '@material-ui/core'

import * as HELPER from './data/backgroundHelper.js'

import KarunaConnect from './KarunaConnect.jsx'
import KarunaBubble from './KarunaBubble.jsx'
import KarunaTextBoxManager from './KarunaTextBoxManager.jsx'

// Colorful logger (enable if logging is needed)
// import { makeLogger } from '../../util/Logger.js'
// const LOG = makeLogger('UNIFIED React App', 'lavender', 'black')

// The sidebar Karuna Connect object
export default function UnifiedApp (props) {
  // De-construct props
  const { emitter, context } = props

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

  // Track karuna server messages globally
  const setKarunaMessageState = useSetRecoilState(KarunaMessageState)
  useEffect(() => {
    emitter.on('karunaMessage', (newMessage) => {
      setKarunaMessageState(newMessage)
    })
  }, [emitter, setKarunaMessageState])

  return (
    <React.Fragment>
      <CssBaseline />
      <KarunaConnect context={context} />
      <KarunaBubble context={context} />
      <KarunaTextBoxManager context={context} emitter={emitter} />
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
