import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Modal, IconButton, Button, Checkbox, FormControlLabel } from '@material-ui/core'

import Emoji from './Emoji.jsx'

import * as DBShapes from './dataTypeShapes.js'
import { backgroundMessage } from '../AJAXHelper.js'

const EMOJI_UNKNOWN = {
  emote: <Emoji padMore key='unknown' label='unknown' symbol='?' />,
  id: '0'
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2)
  },
  moodPickerPaper: {
    position: 'absolute',
    width: 250,
    bottom: 400,
    right: 75,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2)
  },
  panelButton: {
    width: '100%',
    justifyContent: 'left',
    textTransform: 'none',
    marginTop: '15px',
    marginBottom: '5px',
    fontSize: '14px',
    whiteSpace: 'nowrap'
  }
}))

// Menu of moods for user selection
export default function MoodSelect (props) {
  // Styling classes
  const classes = useStyles()

  // Setup component state
  const [open, setOpen] = useState(false)
  const [shareDialog, setDialogOpen] = useState(false)
  const [clickedMood, setClickedMood] = useState(props.currentAffectID || '0')
  const [curPrivacy, setCurPrivacy] = useState(props.privacy.private)
  const [silencePromptCB, setSilencePromptCB] = useState(!props.privacy.prompt)

  // Check emoji list, stop here if it is null/empty
  if (props.emojiList === null || props.emojiList.length < 1) {
    return (
      <Button color="default" className={classes.panelButton} disabled>
        {EMOJI_UNKNOWN}
        Mood
      </Button>
    )
  }

  // pushes emojis from the database into an array of Emoji objects
  const EMOJI = {}
  props.emojiList.forEach((entry) => {
    if (entry._id && entry.active) {
      EMOJI[entry._id] = {
        emote: <Emoji padMore key={entry._id} label={entry.name} symbol={entry.characterCodes[0]} />,
        id: entry._id
      }
    }
  })

  // Update state of tracked checkbox
  const silenceChange = (event) => {
    setSilencePromptCB(event.target.checked)
  }

  // Sets mood and closes menu
  const handleMenuItemClick = (newId) => {
    setClickedMood(newId)
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
  const handleShareClose = (newMoodID, isPrivate) => {
    // Update privacy state
    if (curPrivacy !== isPrivate) { setCurPrivacy(isPrivate) }
    backgroundMessage(
      { type: 'write', key: 'privacy', data: { private: isPrivate, prompt: !silencePromptCB } },
      'Failed to update privacy prompt preferences: ', () => {}
    )

    // Trigger callback for new mood
    if (props.handleChange) {
      props.handleChange(newMoodID, isPrivate)
    } else {
      console.error('Handle change callback for mood missing')
    }

    // Close the dialog
    setDialogOpen(false)
  }

  // Maps the modal body with the desired emotes
  const body = (
    <div className={classes.moodPickerPaper}>
      {Object.values(EMOJI).map((emote) => (
        <IconButton size='small' key={emote.id}
          selected={clickedMood === emote.id}
          onClick={() => {
            handleMenuItemClick(emote.id)
            if (!silencePromptCB) {
              handleShareOpen()
            } else {
              handleShareClose(emote.id, curPrivacy)
            }
          }}>
          {emote.emote}
        </IconButton>
      ))}
    </div>
  )

  // Confirmation modal allows user to share feelings with team or keep private
  const shareModal = (
    <div id='mood-share-modal' className={classes.paper}>
      <p>Do you want to share your feelings with the rest of the team?</p>
      <span>
        <Button onClick={() => { handleShareClose(clickedMood, true) }} size='small'>
          No, Keep Private
        </Button>
        <Button onClick={() => { handleShareClose(clickedMood, false) }} size='small'>
          Yes, Share
        </Button>
      </span>
      <div>
        <FormControlLabel className="small-text" value="silencePrompt" control={<Checkbox color="primary" />}
          label="Do not show this message in the future" labelPlacement="end" onChange={silenceChange} checked={silencePromptCB} />
      </div>
    </div>
  )

  // builds the mood selector and modal
  return (
    <div>
      <Button color="default" aria-controls="mood-menu" aria-haspopup="true" onClick={handleOpen} className={classes.panelButton}>
        {props.currentAffectID && props.currentAffectID !== '0' ? EMOJI[props.currentAffectID].emote : EMOJI_UNKNOWN.emote}
        Mood
      </Button>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
      <Modal open={shareDialog} onClose={handleShareClose}>
        {shareModal}
      </Modal>
    </div>
  )
}

MoodSelect.propTypes = {
  // Callback function to pass a new affect request back up to the parent
  handleChange: PropTypes.func,

  // Karuna user data
  privacy: PropTypes.shape({
    private: PropTypes.bool,
    prompt: PropTypes.bool
  }),
  currentAffectID: PropTypes.string,
  emojiList: PropTypes.arrayOf(
    PropTypes.shape(DBShapes.AffectObjectShape)
  )
}
