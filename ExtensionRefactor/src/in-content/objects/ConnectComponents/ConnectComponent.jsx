import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import ConnectForm from './ConnectForm.jsx'
import ConnectPanelButton from './ConnectPanelButton.jsx'

import { backgroundMessage } from '../AJAXHelper.js'

// The sidebar Karuna Connect object
export default function ConnectComponent (props) {
  // Form mode state (history, mood form open/closed)
  const [formOpen, updateFormOpen] = useState(false)
  const [historyFormOpen, updateHistoryFormOpen] = useState(false)

  // User/Karuna data state
  const [emojiList, updateEmojiList] = useState([])
  const [userStatus, updateUserStatus] = useState(null)
  const [privacy, updatePrivacy] = useState({ private: true, prompt: true })
  const [loginTrigger, updateLoginTrigger] = useState(0)

  // Initialize the privacy preferences
  useEffect(() => {
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
  }, [])

  // Initialize the emoji list
  useEffect(() => {
    // Send ajax request for data via background script
    backgroundMessage(
      { type: 'ajax-getEmojiList', loginTrigger },
      'Emoji Retrieval failed: ',
      (data) => { updateEmojiList(data) }
    )
  }, [loginTrigger])

  // Synchronize user state
  const getLatestUserStatus = () => {
    console.log('[[REACT]] Retrieving last user status')
    backgroundMessage(
      { type: 'ajax-getUserStatus' },
      'Retrieving current user status failed: ',
      (currentUserStatus) => {
        console.log('[[REACT]] User status retrieved:')
        console.log(currentUserStatus)
        if (props.emitter) { props.emitter.emit('userStatusChanged', currentUserStatus) }
        updateUserStatus(currentUserStatus)
      }
    )
  }

  // Set new user mood (triggers a userState update)
  const setUserMood = async (affectID, privacy) => {
    console.log('[[REACT]] Updating user mood')
    backgroundMessage(
      { type: 'ajax-setUserAffect', affectID, privacy },
      'Setting mood failed: ', () => {
        console.log('[[REACT]] user mood updated')
        getLatestUserStatus()
      }
    )
  }

  // Set new user mood (triggers a userState update)
  const setCollaboration = (newCollaboration) => {
    console.log('[[REACT]] Updating user collaboration status')
    backgroundMessage(
      { type: 'ajax-setCollaboration', collaboration: newCollaboration },
      'Setting collaboration failed: ', () => {
        console.log('[[REACT]] User collaboration status updated')
        getLatestUserStatus()
      }
    )
  }

  // Trigger first retrieval of user state
  useEffect(() => { getLatestUserStatus() }, [])

  // Listen for a login
  if (props.emitter) {
    props.emitter.on('login', () => {
      updateLoginTrigger(loginTrigger + 1)
      getLatestUserStatus()
    })
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
      <ConnectForm userStatus={userStatus} emojiList={emojiList} privacy={privacy} opened={formOpen}
        handleAffectChange={setUserMood} handleCollaborationChange={setCollaboration} handleClose={handleClick}
        handleHistoryFormOpen={handleHistoryClick} handleHistoryFormBack={handleHistoryBackClick} />
    </React.Fragment>
  )
}

ConnectComponent.propTypes = {
  emitter: PropTypes.object
}
