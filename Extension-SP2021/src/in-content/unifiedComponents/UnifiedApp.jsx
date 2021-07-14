/* global EventEmitter3 */

import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { LoggedInUserState } from './data/globalState.js'

import { CssBaseline } from '@material-ui/core'

import * as HELPER from './data/backgroundHelper.js'

import KarunaConnect from './KarunaConnect.jsx'
import KarunaBubble from './KarunaBubble.jsx'

// Colorful logger
import { makeLogger } from '../../util/Logger.js'
import KarunaTextBoxManager from './KarunaTextBoxManager.jsx'
const LOG = makeLogger('UNIFIED React App', 'lavender', 'black')

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

  // General to all karuna components
  const [affectPrivacy, setAffectPrivacy] = useState(null)

  const getPrivacy = useCallback(async () => {
    try {
      const privacyFromStorage = await HELPER.retrieveMoodPrivacy(context)
      LOG('New Affect Privacy', privacyFromStorage)
      setAffectPrivacy(privacyFromStorage)
    } catch (err) {
      LOG('Failed to retrieve affect privacy:', err.message)
    }
  }, [context])

  // Retrieve initial values for all state
  useEffect(() => {
    getPrivacy()
  }, [getPrivacy])

  // Functions to update state asynchronously
  const updatePrivacy = async (newPrivacy) => {
    if (!newPrivacy) {
      LOG.error('(WARNING) Refusing to set privacy to null/undefined')
      return
    }

    try {
      await HELPER.setMoodPrivacy(newPrivacy, context)
      LOG('Affect Privacy Updated', newPrivacy)
      setAffectPrivacy(newPrivacy)
    } catch (err) {
      LOG.error('Failed to update affect privacy:', err.message)
    }
  }

  // Group of props that we pass to several different children components
  const commonProps = {
    affectPrivacy,
    updatePrivacy
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <KarunaConnect context={context} {...commonProps} />
      <KarunaBubble context={context} {...commonProps} />
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
