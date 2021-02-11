import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Modal, IconButton, Button, Checkbox } from '@material-ui/core'
import Emoji from './Emoji.jsx'

import { backgroundMessage } from '../AJAXHelper.js'

const EMOJI = [<Emoji key='unknown' label='unknown' symbol='?' />]
const EMOJI_STATE = {
  UNINITIALIZED: 0,
  RETRIEVING: 1,
  READY: 2
}
let currentState = EMOJI_STATE.UNINITIALIZED

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2)
  }
}))

// Menu of moods for user selection
export default function MoodSelect () {
  const classes = useStyles()
  const [mood, setMood] = useState(0)
  const [open, setOpen] = useState(false)
  const [shareDialog, setDialogOpen] = useState(false)
  const [emojisReady, setEmojisReady] = useState(currentState)

  // Initialize emoji list if not yet ready
  if (mood === 0) {
    // Send message to background to retrieve EMOJI list
    chrome.runtime.sendMessage({ type: 'getuser' }, (data) => {
      // Did an error occur
      if (data.error) {
        // Alert user and log error
        window.alert('User data retrieval failed: ' + data.error.message)
        console.log(data.error)
      } else {
        // Retrieve user's most recent mood (TODO)
        chrome.runtime.sendMessage({ type: 'ajax-getUserStatus', userID: data.id }, (data2) => {
          console.log('[[MoodSelector]] data received: ', data2)
        })
      }
    })
  }

  // pushes emojis from the database into an array of Emoji objects
  function buildEmojiList (data) {
    EMOJI.splice(0)
    data.forEach((entry) => {
      EMOJI.push(<Emoji key={entry.name} label={entry.name} symbol={entry.emoji} />)
    })
    currentState = EMOJI_STATE.READY
    setEmojisReady(EMOJI_STATE.READY)
  }

  if (emojisReady === EMOJI_STATE.UNINITIALIZED) {
    // Indicate it is being retrieved
    currentState = EMOJI_STATE.RETRIEVING
    setEmojisReady(EMOJI_STATE.RETRIEVING)
    backgroundMessage({ type: 'ajax-getEmojiList' }, 'Emoji Retrieval failed: ', buildEmojiList)
  }

  // Sets mood and closes menu
  const handleMenuItemClick = (event, index) => {
    setMood(index)
    setOpen(false)
  }

  // Opens the modal
  const handleOpen = () => {
    setOpen(true)
  }

  // Closes the modal
  const handleClose = () => {
    setOpen(false)
  }

  // Opens the share-with-team dialog
  const handleShareOpen = () => {
    setDialogOpen(true)
  }

  // Closes the share-with-team dialog
  const handleShareClose = () => {
    setDialogOpen(false)
  }

  // Maps the modal body with the desired emotes
  const body = (
    <div className='mood-modal'>
      {EMOJI.map((emote, index) => (
        <IconButton
          size='small'
          key={index}
          selected={index === mood}
          onClick={(event) => {
            handleMenuItemClick(event, index)
            handleShareOpen()
          }}
        >
          {emote}
        </IconButton>
      ))}
    </div>
  )

  // Confirmation modal allows user to share feelings with team or keep private
  const shareModal = (
    <div id='mood-share-modal' className={classes.paper}>
      <p>Do you want to share your feelings with the rest of the team?</p>
      <span>
        <Button onClick={handleShareClose} size='small'>
          No, Keep Private
        </Button>
        <Button onClick={handleShareClose} size='small'>
          Yes, Share
        </Button>
      </span>
      <div>
        <span className='small-text'>
          <Checkbox />
          Do not show this message in the future
        </span>
      </div>
    </div>
  )

  // builds the mood selector and modal
  return (
    <div>
      <span>
        <IconButton size='small' aria-controls='mood-menu' aria-haspopup='true' onClick={handleOpen}>
          {EMOJI[mood]}
        </IconButton>
        mood
      </span>
      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
      <Modal 
        open={shareDialog}
        onClose={handleShareClose}
      >
        {shareModal}
      </Modal>
    </div>
  )
}
