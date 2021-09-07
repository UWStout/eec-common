import React, { useState } from 'react'
import { IconButton, TextField } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import AlarmIcon from '@material-ui/icons/Alarm'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import TvIcon from '@material-ui/icons/Tv'
import TvOffIcon from '@material-ui/icons/TvOff'

const useStyles = makeStyles({
  karunaSettingsBody: {
    padding: '5px 0px 5px 0px'
  }
})

export default function KarunaSettings () {
  const classes = useStyles()
  const [nonRelatedMessages, updateNonRelatedMessages] = useState(false)

  const handleThumbsUp = () => {
    updateNonRelatedMessages(true)
  }

  const handleThumbsDown = () => {
    updateNonRelatedMessages(false)
  }

  const unrelatedMsgPreference = nonRelatedMessages ? <TvIcon /> : <TvOffIcon />

  return (
    <div>
      <div className={classes.karunaSettingsBody}>
        <span>
          <AlarmIcon />
          Collaboration timeout
        </span>
      </div>
      <TextField
        id='outlined-number'
        className={classes.karunaSettingsBody}
        label='timeout'
        type='number'
        InputLabelProps={{
          shrink: true
        }}
      />
      <div className={classes.karunaSettingsBody}>
        <div>
          <span>
            {unrelatedMsgPreference}
            Non project-related messages
          </span>
        </div>
        <IconButton onClick={handleThumbsUp}>
          <ThumbUpIcon />
        </IconButton>
        <IconButton onClick={handleThumbsDown}>
          <ThumbDownIcon />
        </IconButton>
      </div>
    </div>
  )
}
