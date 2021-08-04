import React, { useEffect, useState } from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { AffectListState, LastSelectedAffectIDState, UserStatusState, PushActivityState } from '../data/globalState.js'

import { Grid, Typography, Link } from '@material-ui/core'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../util/Logger.js'
// const LOG = makeLogger('CONNECT Status Activity', 'pink', 'black')

export default function UserStatusDetails (props) {
  // Subscribe to the global emojiList state and current status (GLOBAL STATE)
  const emojiList = useRecoilValue(AffectListState)
  const currentStatus = useRecoilValue(UserStatusState)
  const pushActivity = useSetRecoilState(PushActivityState)

  const selectedAffectID = useRecoilValue(LastSelectedAffectIDState)
  const [selectedAffect, setSelectedAffect] = useState(null)

  // Lookup the affect object for the current affectID
  const currentAffect = emojiList.find((item) => {
    return item._id === currentStatus?.currentAffectID
  })

  useEffect(() => {
    const affect = emojiList.find((item) => {
      if (selectedAffectID) return item._id === selectedAffectID
      else return item._id === currentStatus?.currentAffectID
    })
    setSelectedAffect(affect)
  }, [currentStatus?.currentAffectID, emojiList, selectedAffectID])

  // Open the affect survey by pushing its activity
  const openAffectSurvey = () => {
    pushActivity(ACTIVITIES.AFFECT_SURVEY)
  }

  return (
    <Grid container spacing={2}>

      {/* Affect / Mood */}
      <Grid item xs={12}>
        <Typography variant="body1">
          {'I\'m feeling: '}
          <Link aria-label={'Open Affect Survey'} href='#' onClick={openAffectSurvey}>
            {`${selectedAffect ? selectedAffect.characterCodes[0] : (currentAffect ? currentAffect.characterCodes[0] : '?')} ${selectedAffect ? selectedAffect.name : (currentAffect ? currentAffect.name : '[none]')}`}
          </Link>
        </Typography>
      </Grid>

      {/* Willingness to collaborate */}
      <Grid item xs={12}>
        <Typography variant="body1">
          {'My collaboration status is: '}
          {currentStatus ? (currentStatus.collaboration ? '🧑‍🤝‍🧑' : '🧍') : '?'}
        </Typography>
      </Grid>

      {/* Time-to-respond */}
      <Grid item xs={12}>
        <Typography variant="body1">
          {`I generally take ${currentStatus?.timeToRespond > 0 ? (currentStatus.timeToRespond / 60).toFixed(1) : '?'}h to respond`}
        </Typography>
      </Grid>
    </Grid>
  )
}
