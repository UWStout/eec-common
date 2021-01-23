import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';

const useStyles = makeStyles((theme) => ({
  TypResponsTimeRoot: {
    padding: theme.spacing(1),
  }
}))

export default function TypicalResponseTime (props) {
  const classes = useStyles()

  return(
    <div className={classes.TypResponsTimeRoot}>
      <ChatBubbleOutlineOutlinedIcon />
    </div>
  )
}
