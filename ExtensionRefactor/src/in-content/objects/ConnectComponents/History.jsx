import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Slide, Paper, Grid, IconButton, Switch } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import Emoji from './Emoji.jsx'
import HistoryOneOnOne from './HistoryOneOnOne'
import HistoryTeam from './HistoryTeam'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(1),
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

  const bodyDisplay = switched ? <HistoryTeam /> : <HistoryOneOnOne />

  return (
    <Slide direction='left' in={props.opened} mountOnEnter unmountOnExit>
      <Paper elevations={3} id='eec-history-panel' className={classes.paperRoot}>
        <Grid container spacing={2}>
          <Grid item>
            <IconButton size='small' onClick={() => {
              props.handleClose()
              props.handleHistoryFormOpen()
            }}>
              <CloseIcon />
            </IconButton>
            Karuna History
          </Grid>
          <Grid item>
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
          <Grid item>
            <div className='eec-mood-history-body'>
              {bodyDisplay}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  )
}
