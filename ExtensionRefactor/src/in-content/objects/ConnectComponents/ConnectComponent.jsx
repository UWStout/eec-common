import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ConnectForm from './ConnectForm.jsx'
import ConnectPanelButton from './ConnectPanelButton.jsx'

import * as DBShapes from './dataTypeShapes.js'

import { backgroundMessage } from '../AJAXHelper.js'

// The sidebar Karuna Connect object
export default function ConnectComponent (props) {
  // Form mode state (history, mood form open/closed)
  const [formOpen, updateFormOpen] = useState(false)
  const [historyFormOpen, updateHistoryFormOpen] = useState(false)

  // User/Karuna data state
  const [emojiList, updateEmojiList] = useState(null)
  const [userState, updateUserState] = useState(null)
  const [privacy, updatePrivacy] = useState({})

  // Initialize the privacy preferences
  if (privacy.private === undefined) {
    updatePrivacy({ private: true, prompt: true })
    backgroundMessage(
      { type: 'read', key: 'privacy' },
      'Failed to read privacy preferences: ',
      (newPrivacy) => {
        updatePrivacy({
          private: (newPrivacy?.private === undefined ? true : newPrivacy.private),
          prompt: (newPrivacy?.prompt === undefined ? true : newPrivacy.prompt)
        })
      }
    )
  }

  // Initialize the emoji list
  if (emojiList === null) {
    // Set to empty array to avoid extra retrievals
    updateEmojiList([])

    // Send ajax request for data via background script
    backgroundMessage(
      { type: 'ajax-getEmojiList' },
      'Emoji Retrieval failed: ',
      (data) => { updateEmojiList(data) }
    )
  }

  // Synchronize user state
  const getLatestUserState = () => {
    backgroundMessage(
      { type: 'ajax-getUserStatus' },
      'Retrieving current user status failed: ',
      (currentUserState) => {
        updateUserState(currentUserState)
      }
    )
  }

  // Set new user mood (triggers a userState update)
  const setUserMood = async (newMoodID) => {
    backgroundMessage(
      { type: 'ajax-setUserAffect', affectID: newMoodID },
      'Setting mood failed: ', () => {
        getLatestUserState()
      }
    )
  }

  // Set new user mood (triggers a userState update)
  const setCollaboration = async (newCollaboration) => {
    backgroundMessage(
      { type: 'ajax-setCollaboration', collaboration: newCollaboration },
      'Setting collaboration failed: ', () => {
        getLatestUserState()
      }
    )
  }

  // Trigger first retrieval of user state
  if (userState === null) {
    // Set to simple object to avoid extra retrievals
    updateUserState({ retrieving: true })
    getLatestUserState()
  }

  // Opens and closes main menu
  const handleClick = (e) => {
    const newFormOpen = !formOpen
    updateFormOpen(newFormOpen)
  }

  // Tracks history panel opening for button display
  const handleHistoryClick = (e) => {
    const newHistoryFormOpen = !historyFormOpen
    updateHistoryFormOpen(newHistoryFormOpen)
  }

  const handleHistoryBackClick = () => {
    updateHistoryFormOpen(false)
    updateFormOpen(true)
  }

  // Tracks state of each panel and displays karuna button if neither panel is open
  const PanelOpenButton = !formOpen && !historyFormOpen ? <ConnectPanelButton onClick={handleClick} /> : null

  return (
    <React.Fragment>
      {PanelOpenButton}
      <ConnectForm userStatus={props.userStatus} emojiList={emojiList} silencePrompt={privacy} opened={formOpen}
        handleAffectChange={setUserMood} handleCollaborationChange={setCollaboration} handleClose={handleClick}
        handleHistoryFormOpen={handleHistoryClick} handleHistoryFormBack={handleHistoryBackClick} />
    </React.Fragment>
  )
}

ConnectComponent.propTypes = {
  userStatus: PropTypes.shape(DBShapes.statusObjectShape).isRequired
}
