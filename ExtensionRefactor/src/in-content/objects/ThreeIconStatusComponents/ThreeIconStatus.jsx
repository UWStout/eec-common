import React, { useState } from 'react'
import CollaborationPreference from './CollaborationPreference.jsx'
import MoodStatus from './MoodStatus.jsx'
import TypicalResponseTime from './TypicalResponseTime.jsx'

export default function ThreeIconStatus (props) {
  return(
    <React.Fragment>
      <div className='my-eec-connect-status-icons'>
        <CollaborationPreference />
        <MoodStatus />
        <TypicalResponseTime />
      </div>
      {/* This is a holdover solution. 
          It seems like the team member icon status will have to be hooked onto the correct element,
          not necessarily in the shadowDOM. 
      */}
      <div className='team-eec-connect-status-icons'>
        <span>
          <CollaborationPreference />
          <MoodStatus />
          <TypicalResponseTime />
        </span>
      </div>
    </React.Fragment>
  )
}
