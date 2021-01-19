import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Paper } from '@material-ui/core'
import { blueGrey } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#7db2f0'
  }
}))

export default function ConnectPanelButton (props) {
  const classes = useStyles()

  return (
    <Paper elevation={3} id='eec-connect-button-paper' className={classes.paperRoot}>
      <Button onClick={() => { props.onClick() }} className='eec-connect-button'>
        k
      </Button>
    </Paper>
  )
}
