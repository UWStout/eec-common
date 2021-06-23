import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, withStyles } from '@material-ui/core/styles'
// import { Typography, Grid, GridListTile, GridList, Avatar} from '@material-ui/core'
import { Typography, Grid, GridListTile, Avatar } from '@material-ui/core'
import MuiGridList from '@material-ui/core/GridList'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  }
}))

const GridList = withStyles((theme) => ({
  root: {
    marginLeft: '16px'
  }
}))(MuiGridList)

export default function StatusListItem (props) {
  const { userEmail } = props
  const { root } = useStyles

  return (
    // <Typography variant='body1'>{`Status for ${userEmail}`}</Typography>
    // <React.Fragment className={root}>
    <React.Fragment>
      <Grid>
        <Avatar>U</Avatar>
      </Grid>
      <GridList cellHeight='auto' cols={3}>
        <GridListTile cols={3} rows={1}>
          {/* <ListSubheader component='div'>My Statuses</ListSubheader > */}
          <Typography variant='body1'>My Statuses</Typography >
        </GridListTile>
        <GridListTile cols={1} rows={1}>
          <Typography variant='body1'>😁</Typography>
        </GridListTile >
        <GridListTile cols={1} rows={1}>
          <Typography variant='body1'>👫</Typography>
        </GridListTile>
        <GridListTile cols={1} rows={1}>
          <Typography variant='body1'>🕐</Typography>
        </GridListTile>
      </GridList>
    </React.Fragment>
  )
}

StatusListItem.propTypes = {
  userEmail: PropTypes.string.isRequired
}
