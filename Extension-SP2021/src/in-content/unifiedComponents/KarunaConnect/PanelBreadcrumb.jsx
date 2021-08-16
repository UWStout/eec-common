import React from 'react'
import PropTypes from 'prop-types'

import { ActivityStackState, PopActivityState } from '../data/globalState'
import { useRecoilValue, useRecoilState } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography, IconButton } from '@material-ui/core'
import { KeyboardArrowRight, Cancel } from '@material-ui/icons'

import { ACTIVITIES } from '../Activities/Activities'

const useStyles = makeStyles((theme) => ({
  rootStyle: {
    borderBottom: '1px solid grey',
    width: '100%'
  }
}))

function BackButton (props) {
  return (
    <IconButton aria-label='Backup' size='small' {...props}>
      <Cancel fontSize="inherit" />
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
  const { rootStyle } = useStyles()

  // Get global activity stack info
  const activityStack = useRecoilValue(ActivityStackState)
  const [currentActivityKey, popActivity] = useRecoilState(PopActivityState)

  const backCallback = () => {
    popActivity(currentActivityKey)
  }

  const closeCallback = () => {
    if (onClose) { onClose() }
  }

  // Render
  return (
    <Grid container item xs={12} className={rootStyle}>
      <Grid item xs={11}>
        <Typography variant="subtitle2">
          {'KARUNA'}
          {activityStack.length > 0 ? ` / ${ACTIVITIES[currentActivityKey].title}` : ''}
        </Typography>
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
