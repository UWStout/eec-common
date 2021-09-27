import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, List, Typography } from '@material-ui/core'

import StatusListItem from '../../StatusComponents/StatusListItem.jsx'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Status Message Activity', 'pink', 'black')

const useStyles = makeStyles((theme) => ({
  scrollingList: {
    overflowX: 'hidden',
    overflowY: 'auto',
    maxHeight: '300px'
  }
}))

/**
 * Default blank message when there is nothing else to show
 * (always at the bottom of the stack, should never be popped)
 **/
export default function StatusMessageActivity (props) {
  const { requestHide, cancelHide, message } = props
  const { scrollingList } = useStyles()

  const makeStatus = (user) => (
    <StatusListItem key={user._id} userInfo={user} userStatus={user.status} />
  )

  // Build array of status elements
  const replyToListItems = message.replyToStatus.map(makeStatus)
  const mentionListItems = message.mentionsStatus.map(makeStatus)
  const participantsListItems = message.participantsStatus.map(makeStatus)

  // Show affect survey
  return (
    <div onMouseEnter={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="body1">
            {'Here\'s the status of the most recent collaborators:'}
          </Typography>
        </Grid>
        <Grid item xs={12} className={scrollingList}>
          {replyToListItems &&
            <List role={'list'} component="div" aria-label={'Status of Original Author'}>
              {replyToListItems}
            </List>}
          {mentionListItems &&
            <List role={'list'} component="div" aria-label={'Status of People Mentioned'}>
              {mentionListItems}
            </List>}
          {participantsListItems &&
            <List role={'list'} component="div" aria-label={'Status of Other Participants'}>
              {participantsListItems}
            </List>}
        </Grid>
      </Grid>
    </div>
  )
}

StatusMessageActivity.propTypes = {
  message: PropTypes.shape({
    mentionsStatus: PropTypes.arrayOf(PropTypes.any),
    participantsStatus: PropTypes.arrayOf(PropTypes.any),
    replyToStatus: PropTypes.arrayOf(PropTypes.any)
  }).isRequired,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

StatusMessageActivity.defaultProps = {
  requestHide: null,
  cancelHide: null
}
