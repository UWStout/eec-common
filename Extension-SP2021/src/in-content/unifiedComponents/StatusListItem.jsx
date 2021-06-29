import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Grid, Avatar, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { StatusObjectShape, AffectObjectShape } from './dataTypeShapes.js'

const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'black',
    color: 'white',
    boxShadow: theme.shadows[1],
    fontSize: 11
  }
}))(Tooltip)

export default function StatusListItem (props) {
  const { userEmail, emojiList, currentStatus } = props

  // Lookup the affect from the list
  const affect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  return (
    <Grid container>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Avatar>U</Avatar>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography noWrap variant='body1'>{userEmail === '' ? 'My Statuses' : userEmail}</Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item>
                    <Typography variant='body1'>{affect ? affect.characterCodes[0] : '?'}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body1'>{currentStatus ? (currentStatus.collaboration ? '👫' : '') : '?'}</Typography>
                  </Grid>
                  <Grid item>
                    <CustomTooltip PopperProps={{ disablePortal: true }} placement='top' title={currentStatus?.timeToRespond > 0 ? `${currentStatus.timeToRespond} mins` : '? mins'}>
                      <Typography variant='body1'>🕐</Typography>
                    </CustomTooltip>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

StatusListItem.propTypes = {
}

StatusListItem.propTypes = {
  emojiList: PropTypes.arrayOf(PropTypes.shape(AffectObjectShape)).isRequired,
  userEmail: PropTypes.string,
  currentStatus: PropTypes.shape(StatusObjectShape)
}

StatusListItem.defaultProps = {
  userEmail: '',
  currentStatus: null
}
