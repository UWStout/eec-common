import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Slide, Paper, Grid } from '@material-ui/core'
import { ChevronRight as ChevronRightIcon, PermMedia as PermMediaIcon } from '@material-ui/icons'

import * as DBShapes from './dataTypeShapes.js'

import MoodSelect from './MoodSelector.jsx'
import Emoji from './Emoji.jsx'
import History from './History.jsx'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(2)
  },
  headerButton: {
    width: '100%',
    textTransform: 'none',
    marginBottom: '5px',
    height: '35px'
  },
  firstGridRow: {
    width: '100%',
    padding: 0,
    borderBottom: '1px solid grey'
  },
  panelButton: {
    width: '100%',
    justifyContent: 'left',
    textTransform: 'none',
    marginBottom: '5px'
  },
  gridRow: {
    width: '100%',
    padding: 0
  }
}))

export default function ConnectForm (props) {
  const classes = useStyles()
  const [historyOpen, updateHistoryOpen] = useState(false)

  // Tracks the history panel state
  const handleHistoryClick = (e) => {
    const newHistoryOpen = !historyOpen
    updateHistoryOpen(newHistoryOpen)
  }

  // Tracks the collaboration button state
  const handleCollaborationClick = (e) => {
    if (props.handleCollaborationChange) {
      props.handleCollaborationChange(!props.userStatus.collaboration)
    } else {
      console.error('WARNING: No callback function for collaboration change')
    }
  }

  // Build collaboration icon from userStatus prop
  const collaborationType = props.userStatus.collaboration
    ? <Emoji symbol='🧑‍🤝‍🧑' label='People Holding Hands' />
    : <Emoji symbol='🧍' label='Person Standing' />

  // Return all the form elements
  return (
    <div>
      {/* Display of the mood history panel (when open) */}
      <History opened={historyOpen} handleClose={handleHistoryClick}
        handleHistoryFormOpen={props.handleHistoryFormOpen}
        handleHistoryFormBack={props.handleHistoryFormBack} />

      {/* Display of the main Connect panel */}
      <Slide direction="left" in={props.opened} mountOnEnter unmountOnExit>
        <Paper elevation={3} className={classes.paperRoot}>
          <Grid container>
            {/* Header w/ button to close the panel */}
            <Grid item className={classes.firstGridRow}>
              <Button color="default" onClick={props.handleClose} className={classes.headerButton}>
                Karuna Connect
                <Emoji symbol={<ChevronRightIcon />} label='Right Arrow Close Icon' />
              </Button>
            </Grid>

            {/* Current mood / mood selection */}
            <Grid item className={classes.gridRow}>
              <MoodSelect handleChange={props.handleAffectChange} currentAffectID={props.userStatus.currentAffectID} emojiList={props.emojiList} />
            </Grid>

            {/* Current collaboration state and toggle */}
            <Grid item className={classes.gridRow}>
              <Button color="default" onClick={handleCollaborationClick} className={classes.panelButton}>
                {collaborationType}
                Collaboration
              </Button>
            </Grid>

            {/* Mood history view toggle */}
            <Grid item className={classes.gridRow}>
              <Button color="default" className={classes.panelButton} onClick={() => {
                handleHistoryClick()
                props.handleClose()
                props.handleHistoryFormOpen()
              }}>
                <Emoji symbol='⏳' label='Hourglass Not Done' />
                History
              </Button>
            </Grid>

            {/* Link to Team Culture Document */}
            <Grid item className={classes.gridRow}>
              <Button color="default" className={classes.panelButton} onClick={() => {}}>
                <Emoji symbol={<PermMediaIcon />} label='Documentation Folder Icon' />
                Our Team Culture
              </Button>
            </Grid>

            {/* Link to NVC Info */}
            <Grid item className={classes.gridRow}>
              <Button color="default" className={classes.panelButton} onClick={() => {}}>
                <Emoji symbol={<PermMediaIcon />} label='Documentation Folder Icon' />
                More About NVC
              </Button>
            </Grid>

          </Grid>
        </Paper>
      </Slide>
    </div>
  )
}

ConnectForm.propTypes = {
  // User/Karuna data
  userStatus: PropTypes.shape(DBShapes.StatusObjectShape),
  emojiList: PropTypes.arrayOf(
    PropTypes.shape(DBShapes.AffectObjectShape)
  ),
  privacy: PropTypes.shape({
    private: PropTypes.bool,
    prompt: PropTypes.bool
  }),

  // Callback functions to synchronize user state
  handleAffectChange: PropTypes.func,
  handleCollaborationChange: PropTypes.func,

  // Props/functions to coordinate with the connect button
  opened: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleHistoryFormOpen: PropTypes.func.isRequired,
  handleHistoryFormBack: PropTypes.func.isRequired
}
