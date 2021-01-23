import React, { useState } from 'react'
import CollaborationPreference from './CollaborationPreference.jsx'
import MoodStatus from './MoodStatus.jsx'
import TypicalResponseTime from './TypicalResponseTime.jsx'

export default function ThreeIconStatus (props) {
  return(
    <React.Fragment>
      <div className='eec-connect-status-icons'>
        <CollaborationPreference />
        <MoodStatus />
        <TypicalResponseTime />
      </div>
    </React.Fragment>
  )
}
