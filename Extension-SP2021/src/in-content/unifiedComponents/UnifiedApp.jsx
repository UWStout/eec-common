/* global EventEmitter3 */

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { LoggedInUserState, SelectedUserMood } from './data/globalState.js'

import { CssBaseline } from '@material-ui/core'

import * as HELPER from './data/backgroundHelper.js'

import KarunaConnect from './KarunaConnect.jsx'
import KarunaBubble from './KarunaBubble.jsx'
import MessageTextWrapper from './MessageTextWrapper.jsx'

// Colorful logger
import { makeLogger } from '../../util/Logger.js'
const LOG = makeLogger('UNIFIED React App', 'lavender', 'black')

// The sidebar Karuna Connect object
export default function UnifiedApp (props) {
  // De-construct props
  const { emitter, context } = props

  // Track logged in state globally
  const setLoggedInUserState = useSetRecoilState(LoggedInUserState)
  const setSelectedUserMood = useSetRecoilState(SelectedUserMood)

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
  const [moodHistoryList, setMoodHistoryList] = useState([])
  const [emojiList, setEmojiList] = useState([])
  const [currentStatus, setCurrentStatus] = useState(null)
  const [affectPrivacy, setAffectPrivacy] = useState(null)

  // Functions to retrieve state asynchronously (wrapped in
  // 'useCallback' so they don't change every render)
  const getEmojiList = useCallback(async () => {
    try {
      const emojisFromServer = await HELPER.retrieveAffectList(context)
      // Filter out inactive emojis (old ones that have been removed)
      const filteredEmojis = emojisFromServer.filter((current) => (current.active))
      LOG('New Emoji List', filteredEmojis)
      setEmojiList(filteredEmojis)
    } catch (err) {
      LOG('Failed to retrieve emoji list:', err.message)
    }
  }, [context])

  const getMoodHistoryList = useCallback(async () => {
    try {
      const moodHistoryFromServer = await HELPER.retrieveAffectHistoryList(context)
      // make an array of only the affectIDs
      const mostRecentMoodsWithDuplicates = moodHistoryFromServer
        .map((item) => {
          return item.affectID
        })
      // new Set gets rid of duplicates and slice gets the first 10
      const mostRecentMoods = [...new Set(mostRecentMoodsWithDuplicates)].slice(0, 10)

      LOG('New Mood History List', mostRecentMoods)
      setMoodHistoryList(mostRecentMoods)
    } catch (err) {
      LOG('Failed to retrieve mood history list:', err.message)
    }
  }, [context])

  const getPrivacy = useCallback(async () => {
    try {
      const privacyFromStorage = await HELPER.retrieveMoodPrivacy(context)
      LOG('New Affect Privacy', privacyFromStorage)
      setAffectPrivacy(privacyFromStorage)
    } catch (err) {
      LOG('Failed to retrieve affect privacy:', err.message)
    }
  }, [context])

  const getCurrentStatus = useCallback(async () => {
    try {
      const currentStatusFromServer = await HELPER.retrieveUserStatus(context)
      LOG('New Users Status', currentStatusFromServer)
      setCurrentStatus(currentStatusFromServer)
      setSelectedUserMood(currentStatusFromServer?.currentAffectID)
    } catch (err) {
      LOG('Failed to retrieve user status:', err.message)
    }
  }, [context])

  // Retrieve initial values for all state
  useEffect(() => {
    getEmojiList()
    getMoodHistoryList()
    getPrivacy()
    getCurrentStatus()
  }, [getCurrentStatus, getEmojiList, getMoodHistoryList, getPrivacy])

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

  const updateCurrentAffect = async (newAffectID, privacy = true) => {
    if (!newAffectID) {
      LOG.error('(WARNING) Refusing to set current mood to null/undefined')
      return
    }

    try {
      await HELPER.updateCurrentAffect(newAffectID, privacy, context)
      LOG('Current Mood Updated', newAffectID)
      await getCurrentStatus()
    } catch (err) {
      LOG.error('Failed to update current affect:', err.message)
    }
  }

  // Group of props that we pass to several different children components
  const commonProps = {
    emojiList,
    moodHistoryList,
    currentStatus,
    affectPrivacy,
    updateCurrentAffect,
    updatePrivacy
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Suspense fallback={<div />}>
        <KarunaConnect context={context} {...commonProps} />
      </Suspense>
      <Suspense fallback={<div />}>
        <KarunaBubble context={context} {...commonProps} />
      </Suspense>
      <MessageTextWrapper context={context} />
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
