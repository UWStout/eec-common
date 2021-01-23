import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Emoji from '../ConnectComponents/Emoji.jsx'

const useStyles = makeStyles((theme) => ({
  CollabPrefRoot: {
    padding: theme.spacing(1),
  }
}))

export default function CollaborationPreference (props) {
  const classes = useStyles()

  return(
    <div className={classes.CollabPrefRoot}>
      <Emoji symbol='🧑‍🤝‍🧑' label='People Holding Hands' />
    </div>
  )
}
