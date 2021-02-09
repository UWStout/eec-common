import React from 'react'

import { Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CollaborationPreference from './CollaborationPreference.jsx'
import MoodStatus from './MoodStatus.jsx'
import TypicalResponseTime from './TypicalResponseTime.jsx'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#7db2f0',
    textAlign: 'center'
  }
}))

export default function ThreeIconStatus (props) {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <CollaborationPreference />
      <MoodStatus />
      <TypicalResponseTime />
    </Paper>
  )
}
