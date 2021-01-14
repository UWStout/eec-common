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

  const handleHistoryClick = (e) => {
    const newHistoryOpen = !historyOpen
    updateHistoryOpen(newHistoryOpen)
  }

  return (
    <div>
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
              <Button size='small'>
                <span>
                  <Emoji symbol='🧑‍🤝‍🧑' label='People Holding Hands' />
                  My Collaborations
                </span>
              </Button>
            </div>
          </Grid>
          <Grid item>
            <div>
              <Button size='small' onClick={() => {
                handleHistoryClick()
                props.handleClose()
              }}>
                <span>
                  <Emoji symbol='⏳' label='Hourglass Not Done' />
                  History
                </span>
              </Button>
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
    
    <History opened={historyOpen} handleClose={handleHistoryClick}/>
    </div>
  )
}
