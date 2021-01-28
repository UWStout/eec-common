import React, { useState } from 'react'
import { MenuItem, Modal, IconButton } from '@material-ui/core'
import Emoji from './Emoji.jsx'

const emoji = [
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />
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

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const body = (
    <div className='mood-modal'>
      {emoji.map((emote, index) => (
        <MenuItem
          key={index}
          selected={index === mood}
          onClick={(event) => handleMenuItemClick(event, index)}
        >
          {emote}
        </MenuItem>
      ))}
    </div>
  )

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
