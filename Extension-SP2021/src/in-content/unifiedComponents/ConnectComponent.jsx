import React from 'react'

import { Paper } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  // Styling of the root paper element
  paperRoot: {
    margin: theme.spacing(1),
    width: theme.spacing(16),
    height: theme.spacing(16)
  }
}))

// The sidebar Karuna Connect object
export default function ConnectComponent (props) {
  const classes = useStyles()

  return (
    <Paper elevation={3} className={classes.paperRoot} />
  )
}

ConnectComponent.propTypes = {

}
