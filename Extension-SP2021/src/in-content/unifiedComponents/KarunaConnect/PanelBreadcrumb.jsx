import React from 'react'

import { ActivityStackState } from '../data/globalState'
import { useRecoilValue } from 'recoil'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Breadcrumbs, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  rootStyle: {
    borderBottom: '1px solid grey',
    paddingBottom: '6px',
    width: '100%'
  }
}))

export default function PanelBreadcrumbs () {
  // Create styling class names
  const { rootStyle } = useStyles()

  // Get global activity stack and convert to 'typography' elements
  const activityStack = useRecoilValue(ActivityStackState)

  let crumbs = []
  if (activityStack.length <= 2) {
    crumbs = activityStack.map((activity) => (
      <Typography key={activity} color="primary">{activity}</Typography>
    ))
  } else {
    const currentActivity = activityStack[activityStack.length - 1]
    crumbs = [
      <Typography key={'ellipses'} color="primary">{'...'}</Typography>,
      <Typography key={currentActivity} color="primary">{currentActivity}</Typography>
    ]
  }

  // Render
  return (
    <Grid item xs={12}>
      <Breadcrumbs aria-label="Karuna Breadcrumbs" className={rootStyle}>
        <Typography color="primary">Karuna</Typography>
        {crumbs}
      </Breadcrumbs>
    </Grid>
  )
}
