import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, List, ListItem, ListItemIcon } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    border: '1px solid lightgrey'
  },
  listItem: {
    paddingRight: theme.spacing(2)
  }
}))

const ITEM_COUNT = 10

/**
 * affect survey pops up in the panel and in the bubble.
 **/
export default function AffectSurveyActivitySkeleton (props) {
  const { listRoot, listItem } = useStyles()

  // Affect Survey Skeleton
  return (
    <Grid container spacing={1} role={'region'} aria-label={'Affect Survey Loading'} >
      <Grid item xs={12}>
        {/* Search Bar */}
        <Skeleton variant="rect" height={40} width={264} />
      </Grid>
      <Grid item xs={12}>
        {/* Emoji List */}
        <List dense className={listRoot}>
          {[...Array(ITEM_COUNT).keys()].map((key) => (
            <ListItem key={key} className={listItem}>
              <ListItemIcon><Skeleton variant="circle" width={24} height={24} /></ListItemIcon>
              <Skeleton variant="text" width="100%" />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}
