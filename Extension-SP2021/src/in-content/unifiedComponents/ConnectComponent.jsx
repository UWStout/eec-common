/* global EventEmitter3 */

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import ConnectStatusPanel from './ConnectStatusPanel.jsx'
import ConnectMainPanel from './ConnectMainPanel.jsx'
import { PersistentBubble } from './PersistentBubble.jsx'
import FeedbackDialogue from './FeedbackDialogue/FeedbackDialogue.jsx'

import * as HELPER from './backgroundHelper.js'

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
export default function ConnectComponent ({ context, emitter }) {
  // Deconstruct props and style class names
  const { rootDiscord, rootTeams } = useStyles()

  // Is the mouse over this component
  const [mainPanelOpen, setMainPanelOpen] = useState(false)
  const [feedbackDialogueOpen, setFeedbackDialogueOpen] = useState(false)

  // Data shared throughout the connect panel is managed here
  const [emojiList, setEmojiList] = useState([])
  const [moodHistoryList, setMoodHistoryList] = useState([])
  const [currentStatus, setCurrentStatus] = useState(null)
  const [affectPrivacy, setAffectPrivacy] = useState(null)
  const [contextIndicator, setContextIndicator] = useState(true)

  // Functions to retrieve state asynchronously
  const getEmojiList = async () => {
    try {
      const emojisFromServer = await HELPER.retrieveAffectList(context)
      // Filter out inactive emojis (old ones that have been removed)
      const filteredEmojis = emojisFromServer.filter((current) => (current.active))
      LOG('New Emoji List', filteredEmojis)
      setEmojiList(filteredEmojis)
    } catch (err) {
      LOG.error('Failed to retrieve emoji list', err)
    }
  }

  const getMoodHistoryList = async () => {
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
      LOG.error('Failed to retrieve mood history list', err)
    }
  }

  const getPrivacy = async () => {
    try {
      const privacyFromStorage = await HELPER.retrieveMoodPrivacy(context)
      LOG('New Affect Privacy', privacyFromStorage)
      setAffectPrivacy(privacyFromStorage)
    } catch (err) {
      LOG.error('Failed to retrieve affect privacy', err)
    }
  }

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
      LOG.error('Failed to update affect privacy', err)
    }
  }

  const getCurrentStatus = async () => {
    try {
      const currentStatusFromServer = await HELPER.retrieveUserStatus(context)
      LOG('New Users Status', currentStatusFromServer)
      setCurrentStatus(currentStatusFromServer)
    } catch (err) {
      LOG.error('Failed to retrieve user status', err)
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
      LOG.error('Failed to update current affect', err)
    }
  }

  // Retrieve initial values for all state
  useEffect(() => {
    getEmojiList()
    getMoodHistoryList()
    getPrivacy()
    getCurrentStatus()
  }, [])

  // Main render
  return (
    <div>
      <div className={(context === 'msTeams' ? rootTeams : rootDiscord)}>
        <ConnectStatusPanel
          hidden={mainPanelOpen}
          onHide={() => { setMainPanelOpen(true) }}
          currentStatus={currentStatus}
          affectPrivacy={affectPrivacy}
        />
        <ConnectMainPanel
          hidden={!mainPanelOpen}
          onHide={() => { setMainPanelOpen(false) }}
          emojiList={emojiList}
          recentList={moodHistoryList}
          currentStatus={currentStatus}
          affectPrivacy={affectPrivacy}
          updateCurrentAffect={updateCurrentAffect}
          updatePrivacy={updatePrivacy}
        />
      </div>
      <FeedbackDialogue hidden={!feedbackDialogueOpen}>
        <PersistentBubble
          isContextIndicated={contextIndicator}
          openFeedbackDialogue={() => { setFeedbackDialogueOpen(!feedbackDialogueOpen) }}
        />
      </FeedbackDialogue>
    </div>
  )
}

ConnectComponent.propTypes = {
  emitter: PropTypes.instanceOf(EventEmitter3).isRequired,
  context: PropTypes.string.isRequired
}
