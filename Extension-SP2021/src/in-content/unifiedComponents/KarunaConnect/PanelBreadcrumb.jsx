import React from 'react'
import PropTypes from 'prop-types'

import { DisableInputState } from '../data/globalSate/appState.js'
import { ConnectActivityStackState, PopConnectActivityState } from '../data/globalSate/connectActivityState.js'
import { useRecoilValue, useRecoilState } from 'recoil'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Grid, Typography, IconButton, Tooltip } from '@material-ui/core'
import { KeyboardArrowRight, KeyboardArrowLeft, Cancel } from '@material-ui/icons'

import MuiDivider from '@material-ui/core/Divider'

import { ACTIVITIES } from './Activities/Activities'
import TeamTabs from './TeamTabs.jsx'

const useStyles = makeStyles((theme) => ({
  rootStyle: {
    margin: theme.spacing(0, 0, 2, 0)
  }
}))

const Divider = withStyles((theme) => ({
  root: {
    width: '100%'
  }
}))(MuiDivider)

function BackButton (props) {
  return (
    <Tooltip title="Go Back" PopperProps={{ disablePortal: true }}>
      <IconButton aria-label='Back' size='small' {...props}>
        <KeyboardArrowLeft fontSize="inherit" />
      </IconButton>
    </Tooltip>
  )
}

function DismissButton (props) {
  return (
    <Tooltip title="Return Home" PopperProps={{ disablePortal: true }}>
      <IconButton aria-label='Return Home' size='small' {...props}>
        <Cancel fontSize="inherit" />
      </IconButton>
    </Tooltip>
  )
}

function HideButton (props) {
  return (
    <Tooltip title="Hide the Connect Panel" PopperProps={{ disablePortal: true }}>
      <IconButton aria-label='Hide Panel' size='small' {...props}>
        <KeyboardArrowRight fontSize="inherit" />
      </IconButton>
    </Tooltip>
  )
}

export default function PanelBreadcrumbs (props) {
  // De-structure the props
  const { onClose, noBack, noDismiss } = props

  // Create styling class names
  const { rootStyle } = useStyles()

  // Get global activity stack info
  const activityStack = useRecoilValue(ConnectActivityStackState)
  const [currentActivityKey, popActivity] = useRecoilState(PopConnectActivityState)
  const disableAllInput = useRecoilValue(DisableInputState)

  // Backup one activity
  const backCallback = () => { popActivity(currentActivityKey) }

  // Dismiss all activities and return to the main one
  const dismissCallback = () => {
    // Work backwards and pop all activities except the last one
    for (let i = activityStack.length - 1; i > 0; i--) {
      popActivity(activityStack[i])
    }
  }

  // Hide the main drawer
  const hideCallback = () => { if (onClose) { onClose() } }

  // Render
  return (
    <Grid container item xs={12} className={rootStyle}>
      <Grid container item xs={12} justifyContent="space-between" alignItems="center">
        {activityStack.length > 1 && !noBack &&
          <BackButton onClick={backCallback} disabled={disableAllInput} />}
        <Typography variant="h6" component="h2">
          {activityStack.length > 1 ? ACTIVITIES[currentActivityKey].title : 'Karuna Connect'}
        </Typography>
        {activityStack.length <= 1 &&
          <HideButton onClick={hideCallback} disabled={disableAllInput} />}
        {activityStack.length > 1 && !noDismiss &&
          <DismissButton onClick={dismissCallback} disabled={disableAllInput} />}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {/* AIW this is a placeholder for an eventual tabbed teamName carousel component */}
        {/* <Typography variant="caption">{teammatesInfo?.length > 0 ? teammatesInfo[0].teamName : 'Unknown Team'}</Typography> */}
        <TeamTabs />
      </Grid>
    </Grid>
  )
}

PanelBreadcrumbs.propTypes = {
  onClose: PropTypes.func,
  noBack: PropTypes.bool,
  noDismiss: PropTypes.bool
}

PanelBreadcrumbs.defaultProps = {
  onClose: null,
  noBack: false,
  noDismiss: false
}
