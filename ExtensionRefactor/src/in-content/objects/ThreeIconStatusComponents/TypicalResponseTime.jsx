import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';

const useStyles = makeStyles((theme) => ({
  TypResponseTimeRoot: {
    padding: theme.spacing(1)
  }
}))

export default function TypicalResponseTime (props) {
  const classes = useStyles()
  const responseTime = props.status === '-1' ? <ChatBubbleOutlineOutlinedIcon /> : props.status

  return (
    <div className={classes.TypResponseTimeRoot}>
      {responseTime}
    </div>
  )
}
