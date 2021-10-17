import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import { BubbleActiveStatusMessageState } from '../../data/globalSate/bubbleActivityState.js'

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
  },
  primaryStyle: {
    textDecoration: 'underline',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  }
}))

/**
 * Default blank message when there is nothing else to show
 * (always at the bottom of the stack, should never be popped)
 **/
export default function StatusMessageActivity (props) {
  const { requestHide, cancelHide } = props
  const { scrollingList, primaryStyle } = useStyles()

  // Empty lists of status items
  let replyToListItems = []
  let mentionListItems = []
  let participantsListItems = []

  // Track the currently active message
  const statusMessage = useRecoilValue(BubbleActiveStatusMessageState)

  // Build array of status elements
  if (Array.isArray(statusMessage?.replyToStatus) || Array.isArray(statusMessage?.mentionsStatus) || Array.isArray(statusMessage?.participantsStatus)) {
    const makeStatus = (user) => (
      <StatusListItem key={user._id} userInfo={user} userStatus={user.status} spacingBottom={3} showName />
    )

    replyToListItems = statusMessage.replyToStatus.map(makeStatus)
    mentionListItems = statusMessage.mentionsStatus.map(makeStatus)
    participantsListItems = statusMessage.participantsStatus.map(makeStatus)
  }

  const [replyCount, setReplyCount] = useState(0)
  const [mentionCount, setMentionCount] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)
  useEffect(() => {
    if (replyCount !== replyToListItems.length ||
      mentionCount !== mentionListItems.length ||
      participantCount !== participantsListItems.length) {
      window.dispatchEvent(new Event('resize'))
    }

    setReplyCount(replyToListItems.length)
    setMentionCount(mentionListItems.length)
    setParticipantCount(participantsListItems.length)
  }, [mentionCount, mentionListItems.length, participantCount, participantsListItems.length,
    replyCount, replyToListItems.length, statusMessage])

  // Show affect survey
  return (
    <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <Grid container>
        <Grid item xs={12} className={scrollingList}>
          {replyToListItems.length > 0 &&
            <List role={'list'} component="div" aria-label={'Status of Original Author'}>
              <Typography className={primaryStyle}>{'Replying to:'}</Typography>
              {replyToListItems}
            </List>}
          {mentionListItems.length > 0 &&
            <List role={'list'} component="div" aria-label={'Status of People Mentioned'}>
              <Typography className={primaryStyle}>{'Mentioned:'}</Typography>
              {mentionListItems}
            </List>}
          {participantsListItems.length > 0 &&
            <List role={'list'} component="div" aria-label={'Status of Other Participants'}>
              <Typography className={primaryStyle}>{'Thread participants:'}</Typography>
              {participantsListItems}
            </List>}
        </Grid>
      </Grid>
    </div>
  )
}

StatusMessageActivity.propTypes = {
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

StatusMessageActivity.defaultProps = {
  requestHide: null,
  cancelHide: null
}
