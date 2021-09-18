import React from 'react'
import PropTypes from 'prop-types'

import { DisableInputState } from '../data/globalSate/appState.js'
import { ConnectActivityStackState, PopConnectActivityState } from '../data/globalSate/connectActivityState.js'
import { useRecoilValue, useRecoilState } from 'recoil'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Grid, Typography, IconButton } from '@material-ui/core'
import { KeyboardArrowRight, Cancel } from '@material-ui/icons'

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
  const activityStack = useRecoilValue(ConnectActivityStackState)
  const [currentActivityKey, popActivity] = useRecoilState(PopConnectActivityState)
  const disableAllInput = useRecoilValue(DisableInputState)

  const backCallback = () => {
    popActivity(currentActivityKey)
  }

  const closeCallback = () => {
    if (onClose) { onClose() }
  }

  // Render
  return (
    <Grid container item xs={12} className={rootStyle}>
      <Grid container item xs={12}>
        <Grid item xs={11}>
          <Typography variant="subtitle2">
            {'KARUNA'}
            {activityStack.length > 0 ? ` / ${ACTIVITIES[currentActivityKey].title}` : ''}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {activityStack.length <= 1 &&
            <CloseButton onClick={closeCallback} disabled={disableAllInput} />}
          {activityStack.length > 1 &&
            <BackButton onClick={backCallback} disabled={disableAllInput} />}
        </Grid>
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
  onClose: PropTypes.func
}

PanelBreadcrumbs.defaultProps = {
  onClose: null
}
