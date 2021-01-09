import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Slide, Paper, Grid, Button } from '@material-ui/core'
import MoodSelect from './MoodSelector.jsx'
import Emoji from './Emoji.jsx'
import CurrencySelect from './CurrencySelect.jsx'
import DateTimeComponent from './DateTimeComponent.jsx'
import DialogSlide from './DialogSlide.jsx'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(1),
  }
}))

export default function ConnectForm (props) {
  const classes = useStyles()

  return (
    <Slide direction="left" in={props.opened} mountOnEnter unmountOnExit>
      <Paper elevation={3} className={classes.paperRoot}>
        <Grid container spacing={2}>
          <Grid item>
            <div>Karuna Connect</div>
          </Grid>
          <Grid item>
            <MoodSelect />
          </Grid>
          <Grid item>
            <div>
              <span>
                <Emoji symbol='🧑‍🤝‍🧑' label='People Holding Hands' />
                My Collaborations
              </span>
            </div>
          </Grid>
          <Grid item>
            <div>
              <span>
                <Emoji symbol='⏳' label='Hourglass Not Done' />
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
  )
}
