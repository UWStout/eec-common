import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Paper, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'

import Emoji from '../ConnectComponents/Emoji.jsx'

import { backgroundMessage } from '../AJAXHelper.js'

const EMOJI_UNKNOWN = <Emoji key='unknown' label='unknown' symbol='?' />
const useStyles = makeStyles((theme) => ({
  paperRoot: {
    backgroundColor: '#7db2f0',
    textAlign: 'center',
    width: '45px',
    height: '125px'
  },
  gridRow: {
    width: '100%',
    padding: '4px',
    lineHeight: 1.4286
  },
  svgIcon: {
    fontSize: '24px'
  }
}))

export default function ThreeIconStatus (props) {
  // Compute custom styles
  const classes = useStyles()

  // Establish component state
  const [emojiList, updateEmojiList] = useState([])
  const [userStatus, updateUserStatus] = useState(null)

  // Initialize the emoji list
  useEffect(() => {
    // Send ajax request for data via background script
    backgroundMessage(
      { type: 'ajax-getEmojiList' },
      'Emoji Retrieval failed: ',
      (data) => { updateEmojiList(data) }
    )
  }, [])

  // Synchronize user state
  // const getLatestUserStatus = () => {
  //   backgroundMessage(
  //     { type: 'ajax-getUserStatus' },
  //     'Retrieving current user status failed: ',
  //     (currentUserStatus) => {
  //       console.log(currentUserStatus)
  //       updateUserStatus(currentUserStatus)
  //     }
  //   )
  // }

  // Listen for user status updates
  useEffect(() => {
    if (props.emitter) {
      props.emitter.on('userStatusChanged', updateUserStatus)
    }
  }, [props.emitter])

  // Initialize the user status
  // useEffect(() => { getLatestUserStatus() }, [])

  // Pick mood icon
  let moodIcon = EMOJI_UNKNOWN
  if (userStatus) {
    for (let i = 0; i < emojiList.length; i++) {
      const entry = emojiList[i]
      if (entry._id === userStatus.currentAffectID && entry.active) {
        moodIcon = <Emoji key={entry._id} label={entry.name} symbol={entry.characterCodes[0]} />
        break
      }
    }
  }

  // Build collaboration icon from userStatus prop
  let collaborationType = <Emoji symbol='?' label='Loading' />
  if (userStatus?.collaboration) {
    collaborationType = <Emoji symbol='🧑‍🤝‍🧑' label='Open to Collaboration' />
  } else {
    collaborationType = <Emoji symbol='🧍' label='Solo Focused' />
  }

  return (
    <Paper elevation={3} className={classes.paperRoot}>
      <Grid container>
        <Grid item className={classes.gridRow}>
          {collaborationType}
        </Grid>
        <Grid item className={classes.gridRow}>
          {moodIcon}
        </Grid>
        <Grid item className={classes.gridRow}>
          <Emoji symbol={<ChatBubbleIcon className={classes.svgIcon} />} label='Time to Respond' />
        </Grid>
      </Grid>
    </Paper>
  )
}

ThreeIconStatus.propTypes = {
  emitter: PropTypes.object
}
