import React, { useState } from 'react'
import { MenuItem, Menu, Button, IconButton } from '@material-ui/core'
import Emoji from './Emoji.jsx'

const emoji = [
  <Emoji symbol='😀' label='happy' />,
  <Emoji symbol='😐' label='neutral' />,
  <Emoji symbol='🙁' label='sad' />
]

export default function MoodSelect () {
  const [mood, setMood] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, index) => {
    setMood(index)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <span>
        <IconButton size='small' aria-controls='mood-menu' aria-haspopup='true' onClick={handleButtonClick}>
          {emoji[mood]}
        </IconButton>
        mood
      </span>
      <Menu
        id='mood-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {emoji.map((emote, index) => (
          <MenuItem
            key={index}
            selected={index === mood}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {emote}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
