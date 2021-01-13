import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Slide, Paper, Grid, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: theme.spacing(1),
  }
}))

export default function History (props) {
  const classes = useStyles()

  return (
    <Slide direction='left' in={props.opened} mountOnEnter unmountOnExit>
      <Paper elevations={3} className={classes.paperRoot}>
        <Grid container spacing={2}>
          <Grid item>
            <IconButton size='small' onClick={props.handleClose}>
              <CloseIcon />
            </IconButton>
            Karuna History
          </Grid>
        </Grid>
      </Paper>
    </Slide>
  )
}
