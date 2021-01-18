import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Slide, Paper, Grid, Button, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MoodSelect from './MoodSelector.jsx'
import Emoji from './Emoji.jsx'
import History from './History.jsx'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(1),
  }
}))

export default function ConnectForm (props) {
  const classes = useStyles()
  const [historyOpen, updateHistoryOpen] = useState(false)
  const [collaboration, updateCollaboration] = useState(false)

  // Tracks the history panel state 
  const handleHistoryClick = (e) => {
    const newHistoryOpen = !historyOpen
    updateHistoryOpen(newHistoryOpen)
  }

  // Tracks the collaboration button state
  const handleCollaborationClick = (e) => {
    const collaborateChange = !collaboration
    updateCollaboration(collaborateChange)
  }

  const collaborationType = collaboration 
    ? <Emoji symbol='🧑‍🤝‍🧑' label='People Holding Hands' /> 
    : <Emoji symbol='🧍' label='Person Standing' />

  return (
    <div>
    <History opened={historyOpen} handleClose={handleHistoryClick} handleHistoryFormOpen={props.handleHistoryFormOpen}/>
    <Slide direction="left" in={props.opened} mountOnEnter unmountOnExit>
      <Paper elevation={3} className={classes.paperRoot}>
        <Grid container spacing={2}>
          <Grid item>
            <div>
              <span>
                <IconButton size='small' onClick={props.handleClose}>
                  <CloseIcon />
                </IconButton>
                Karuna Connect
              </span>
            </div>
          </Grid>
          <Grid item>
            <MoodSelect />
          </Grid>
          <Grid item>
            <div>
              <span>
                <IconButton size='small' onClick={handleCollaborationClick}>
                  {collaborationType}
                </IconButton>
                Collaborations
              </span>
            </div>
          </Grid>
          <Grid item>
            <div>
              <span>
                <IconButton size='small' onClick={() => {
                  handleHistoryClick()
                  props.handleClose()
                  props.handleHistoryFormOpen()
                }}>
                  <Emoji symbol='⏳' label='Hourglass Not Done' />
                </IconButton>
                History
              </span>
            </div>
          </Grid>
          <Grid item>
            <div>
              Our Team Culture
            </div>
          </Grid>
          <Grid item>
            <div>
              More About NVC
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Slide>
    </div>
  )
}
