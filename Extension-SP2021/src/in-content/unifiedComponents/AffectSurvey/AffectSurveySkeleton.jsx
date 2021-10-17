import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, List, ListItem, ListItemIcon } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: theme.spacing(62),
    maxHeight: theme.spacing(62),
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
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
export default function AffectSurveySkeleton (props) {
  const { withTitleText, requestHide, cancelHide } = props
  const { listRoot, listItem, container } = useStyles()

  // Affect Survey Skeleton
  return (
    <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)} className={container}>
      <Grid container spacing={1} role={'region'} aria-label={'Affect Survey Loading'} >
        { withTitleText &&
          <Grid item xs={12}>
            {/* Title Text */}
            <Skeleton height={10} width={264} />
            <Skeleton height={10} width={264} />
            <Skeleton height={10} width="80%" />
          </Grid>}
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
    </div>
  )
}

AffectSurveySkeleton.propTypes = {
  withTitleText: PropTypes.bool,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

AffectSurveySkeleton.defaultProps = {
  withTitleText: false,
  requestHide: null,
  cancelHide: null
}
