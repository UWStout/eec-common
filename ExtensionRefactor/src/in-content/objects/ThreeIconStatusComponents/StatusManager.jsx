import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import ThreeIconStatus from './ThreeIconStatus.jsx'

import { backgroundMessage } from '../AJAXHelper.js'

const useStyles = makeStyles((theme) => ({
  fixedParent: {
    position: 'fixed',
    top: '0px',
    left: '0px'
  }
}))

// A general manager for all status icons (logged in and other users both)
export default function StatusManager (props) {
  const classes = useStyles()

  // User/Karuna data state
  const [emojiList, updateEmojiList] = useState([])
  const [userStatus, updateUserStatus] = useState(null)
  const [loginTrigger, updateLoginTrigger] = useState(0)

  // List of status icon locations and statuses for other users
  const [otherStatusList, updateOtherStatusList] = useState([])

  // Initialize the emoji list
  useEffect(() => {
    // Send ajax request for data via background script
    backgroundMessage(
      { type: 'ajax-getEmojiList', loginTrigger },
      'Emoji Retrieval failed: ',
      (data) => { updateEmojiList(data) }
    )
  }, [loginTrigger])

  // Listen for events from other parts of the in-content scripts
  useEffect(() => {
    if (props.emitter) {
      // A login event
      props.emitter.on('login', () => {
        updateLoginTrigger(loginTrigger + 1)
      })

      // Status icon list update
      props.emitter.on('statusListChanged', updateOtherStatusList)

      // A status update event
      props.emitter.on('userStatusChanged', updateUserStatus)
    }
  }, [props.emitter])

  // Rebuild list of other user status icons
  const statusElementList = []
  for (const discordName in otherStatusList) {
    const curStatus = otherStatusList[discordName]
    statusElementList.push(
      <ThreeIconStatus radial emojiList={emojiList} key={discordName}
        top={curStatus.anchor.top} left={curStatus.anchor.left}
        width={curStatus.dims.width} height={curStatus.dims.height}
        userStatus={curStatus.status} />
    )
  }

  // Render all status icons
  return (
    <React.Fragment>
      <ThreeIconStatus emojiList={emojiList} userStatus={userStatus} />
      <div className={classes.fixedParent}>
        {statusElementList}
      </div>
    </React.Fragment>
  )
}

StatusManager.propTypes = {
  emitter: PropTypes.object
}
