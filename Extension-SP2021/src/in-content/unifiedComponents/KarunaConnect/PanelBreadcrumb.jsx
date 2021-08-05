import React from 'react'
import PropTypes from 'prop-types'

import { ActivityStackState, PopActivityState } from '../data/globalState'
import { useRecoilValue, useRecoilState } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Breadcrumbs, Typography, IconButton, Fade } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  rootStyle: {
    borderBottom: '1px solid grey',
    marginBottom: '6px',
    width: '100%',
    alignItems: 'flex-end'
  },
  buttonStyle: {
    transform: 'translateY(-50%)',
    right: '0px',
    position: 'absolute',
    top: '50%'
  }
}))

function BackButton (props) {
  return (
    <IconButton aria-label='Backup' size='small' {...props}>
      <KeyboardArrowLeft fontSize="inherit" />
    </IconButton>
  )
}

function CloseButton (props) {
  return (
    <IconButton aria-label='Close Panel' size='small' {...props}>
      <KeyboardArrowRight fontSize="inherit" />
    </IconButton>
  )
}

export default function PanelBreadcrumbs (props) {
  // De-structure the props
  const { onClose } = props

  // Create styling class names
  const { rootStyle, buttonStyle } = useStyles()

  // Get global activity stack and convert to 'typography' elements
  const activityStack = useRecoilValue(ActivityStackState)
  const [currentActivity, popActivity] = useRecoilState(PopActivityState)

  let crumbs = []
  if (activityStack.length <= 1) {
    crumbs = activityStack.map((activity) => (
      <Typography key={activity}>{activity}</Typography>
    ))
  } else {
    const currentActivity = activityStack[activityStack.length - 1]
    crumbs = [
      <Typography key={'ellipses'} color="inherit">{'...'}</Typography>,
      <Typography key={currentActivity}>{currentActivity}</Typography>
    ]
  }

  const backCallback = () => {
    popActivity(currentActivity)
  }

  const closeCallback = () => {
    if (onClose) { onClose() }
  }

  // Render
  return (
    <Grid container item xs={12} className={rootStyle} spacing={1}>
      <Grid item xs={3}>
        <Typography variant="button">Karuna</Typography>
      </Grid>
      <Grid item xs={8}>
        <Breadcrumbs aria-label="Karuna Breadcrumbs">
          {crumbs}
        </Breadcrumbs>
      </Grid>
      <Grid item xs={1}>
        {activityStack.length <= 1 &&
          <CloseButton onClick={closeCallback} />}
        {activityStack.length > 1 &&
          <BackButton onClick={backCallback} />}
      </Grid>
    </Grid>
  )
}

PanelBreadcrumbs.propTypes = {
  onClose: PropTypes.func
}

PanelBreadcrumbs.defaultProps = {
  onClose: null
}
