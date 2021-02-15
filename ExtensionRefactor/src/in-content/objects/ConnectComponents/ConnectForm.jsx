import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Slide, Paper, Grid } from '@material-ui/core'

import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import PermMediaIcon from '@material-ui/icons/PermMedia'

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
    height: '35px',
    fontSize: '14px',
    whiteSpace: 'nowrap'
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
    marginBottom: '5px',
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  gridRow: {
    width: '100%',
    padding: 0
  },
  svgIcon: {
    fontSize: '24px'
  },
  svgIconHidden: {
    fontSize: '24px',
    visibility: 'hidden'
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
    // Do nothing until userStatus is not null
    if (!props.userStatus) { return }

    // Toggle user collaboration status if callback provided
    if (props.handleCollaborationChange) {
      props.handleCollaborationChange(!props.userStatus.collaboration)
    } else {
      console.error('WARNING: No callback function for collaboration change')
    }
  }

  // Build collaboration icon from userStatus prop
  let collaborationType = <Emoji padMore symbol='?' label='Loading' />
  if (props.userStatus && props.userStatus.collaboration) {
    collaborationType = <Emoji padMore symbol='🧑‍🤝‍🧑' label='Open to Collaboration' />
  } else {
    collaborationType = <Emoji padMore symbol='🧍' label='Solo Focused' />
  }

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
                <Emoji padMore symbol={<ChevronLeftIcon className={classes.svgIconHidden} />} label='' />
                Karuna Connect
                <Emoji padMore symbol={<ChevronRightIcon className={classes.svgIcon} />} label='Close Panel' />
              </Button>
            </Grid>

            {/* Current mood / mood selection */}
            <Grid item className={classes.gridRow}>
              { props.userStatus
                ? <MoodSelect handleChange={props.handleAffectChange}
                  currentAffectID={props.userStatus.currentAffectID}
                  privacy={props.privacy} emojiList={props.emojiList} />
                : <Button color="default" className={classes.panelButton}>
                  <Emoji padMore symbol="?" label="Loading" />
                  Mood
                </Button>
              }
            </Grid>

            {/* Current collaboration state and toggle */}
            <Grid item className={classes.gridRow}>
              <Button color="default" onClick={props.userStatus ? handleCollaborationClick : () => {}} className={classes.panelButton}>
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
                <Emoji padMore symbol='⏳' label='View Mood History' />
                History
              </Button>
            </Grid>

            {/* Link to Team Culture Document */}
            <Grid item className={classes.gridRow}>
              <Button color="default" className={classes.panelButton} onClick={() => {}}>
                <Emoji padMore symbol={<PermMediaIcon className={classes.svgIcon} />} label='View Team culture (coming soon)' />
                Our Team Culture
              </Button>
            </Grid>

            {/* Link to NVC Info */}
            <Grid item className={classes.gridRow}>
              <Button color="default" className={classes.panelButton} onClick={() => {}}>
                <Emoji padMore symbol={<PermMediaIcon className={classes.svgIcon} />} label='View NVC information (coming soon)' />
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
