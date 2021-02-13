import React from 'react'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CollaborationPreference from './CollaborationPreference.jsx'
import MoodStatus from './MoodStatus.jsx'
import TypicalResponseTime from './TypicalResponseTime.jsx'
import { backgroundMessage } from '../AJAXHelper.js'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#7db2f0',
    textAlign: 'center'
  }
}))

let userStatus = {
  collaboration: 'unknown',
  recentAffect: '?',
  timeToRespondMinutes: '-1'
}

export default function ThreeIconStatus (props) {
  const classes = useStyles()

  // function to handle user status work
  function getUserStatus (data) {
    // grabs data from the background message
    const doWork = (data) => {
      userStatus = data
    }
    // communicates with background
    backgroundMessage(
      { type: 'ajax-getUserStatus', userID: data.id },
      'failed to retrieve status',
      doWork
    )
  }
  // Gets user data
  backgroundMessage({ type: 'getuser' }, 'could not retrieve data', getUserStatus)

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <CollaborationPreference status={ userStatus.collaboration } />
      <MoodStatus status={ userStatus.recentAffect } />
      <TypicalResponseTime status={ userStatus.timeToRespondMinutes } />
    </Paper>
  )
}
