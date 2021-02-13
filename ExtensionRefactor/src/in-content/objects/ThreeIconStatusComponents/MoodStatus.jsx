import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Emoji from '../ConnectComponents/Emoji.jsx'

const useStyles = makeStyles((theme) => ({
  MoodStatusRoot: {
    padding: theme.spacing(1)
  }
}))

export default function MoodStatus (props) {
  const classes = useStyles()
  const moodStatus = props.status === '?' ? <Emoji symbol='😀' label='Grinning Face' /> : props.status

  return (
    <div className={classes.MoodStatusRoot}>
      {moodStatus}
    </div>
  )
}
