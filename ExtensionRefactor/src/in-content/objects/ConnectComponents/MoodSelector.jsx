import React, { useState } from 'react'
import { Modal, IconButton } from '@material-ui/core'
import Emoji from './Emoji.jsx'

// placeholder for dynamic database filling
const emoji = [
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />,
]

// Menu of moods for user selection
export default function MoodSelect () {
  const [mood, setMood] = useState(0)
  const [open, setOpen] = useState(false)

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

  // maps the modal body with the desired emotes
  const body = (
    <div className='mood-modal'>
      {emoji.map((emote, index) => (
        <IconButton
          size='small'
          key={index}
          selected={index === mood}
          onClick={(event) => handleMenuItemClick(event, index)}
        >
          {emote}
        </IconButton>
      ))}
    </div>
  )

  // builds the mood selector and modal
  return (
    <div>
      <span>
        <IconButton size='small' aria-controls='mood-menu' aria-haspopup='true' onClick={handleOpen}>
          {emoji[mood]}
        </IconButton>
        mood
      </span>
      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
    </div>
  )
}
