import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Slide, Paper, Grid, IconButton, Switch, Typography } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import Emoji from './Emoji.jsx'
// import HistoryOneOnOne from './HistoryOneOnOne.jsx'
// import HistoryTeam from './HistoryTeam.jsx'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(2)
  },
  gridRow: {
    width: '100%'
  }
}))

// History menu opens from main menu
export default function History (props) {
  const classes = useStyles()
  const [switched, updateSwitched] = useState(false)

  // Switches between team mood and member mood histories
  const handleSwitch = (event) => {
    const newSwitchedState = !switched
    updateSwitched(newSwitchedState)
  }

  // TODO: Disabled for now
  // const bodyDisplay = switched ? <HistoryTeam /> : <HistoryOneOnOne />

  return (
    <Slide direction='left' in={props.opened} mountOnEnter unmountOnExit>
      <Paper elevations={3} id='eec-history-panel' className={classes.paperRoot}>
        <Grid container spacing={2}>
          <Grid item className={classes.gridRow}>
            <IconButton size='small' onClick={() => {
              props.handleClose()
              props.handleHistoryFormBack()
            }}>
              <ArrowBackIcon />
            </IconButton>
            Karuna History
            <IconButton size='small' onClick={() => {
              props.handleClose()
              props.handleHistoryFormOpen()
            }}>
              <ChevronRightIcon />
            </IconButton>
          </Grid>
          <Grid item className={classes.gridRow}>
            <span>
              <Emoji symbol='👨‍👦' label='Family: Man, Boy'/>
              <Switch
                checked={switched}
                onChange={handleSwitch}
                name='history-switch'
              />
              <Emoji symbol='👨‍👧‍👦' label='Family: Man, Girl, Boy' />
            </span>
          </Grid>
          <Grid item className={classes.gridRow}>
            <Typography>Not yet implemented<br/>(Coming Soon)</Typography>
            {/* <div className='eec-mood-history-body'>
              {bodyDisplay}
            </div> */}
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  )
}

History.propTypes = {
  opened: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  handleHistoryFormOpen: PropTypes.func.isRequired,
  handleHistoryFormBack: PropTypes.func.isRequired
}
