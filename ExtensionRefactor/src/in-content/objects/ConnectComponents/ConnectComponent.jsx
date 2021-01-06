import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Paper, Grid, Button } from '@material-ui/core'
import CurrencySelect from './CurrencySelect.jsx'
import DateTimeComponent from './DateTimeComponent.jsx'
import DialogSlide from './DialogSlide.jsx'

const useStyles = makeStyles({
  paperRoot: {
    padding: '15px'
  }
})

export default function Connect () {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary">
            Hello World
          </Button>
        </Grid>
        <Grid item>
          <CurrencySelect />
        </Grid>
        <Grid item>
          <DateTimeComponent />
        </Grid>
        <Grid item>
          <DialogSlide />
        </Grid>
      </Grid>
    </Paper>
  )
}
