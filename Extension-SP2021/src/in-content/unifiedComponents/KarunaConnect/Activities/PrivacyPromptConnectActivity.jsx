import React from 'react'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter, UserAffectIDState } from '../../data/globalSate/userState.js'
import { LastSelectedAffectIDState, PopActivityState } from '../../data/globalSate/appState.js'

import PrivacyPromptComponent from '../../AffectSurvey/PrivacyPromptComponent.jsx'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Privacy Activity', 'yellow', 'black')

export default function PrivacyPromptConnectActivity (props) {
  // Global data states
  const setPrivacy = useSetRecoilState(PrivacyPrefsStateSetter)
  const setCurrentAffect = useSetRecoilState(UserAffectIDState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const popActivity = useSetRecoilState(PopActivityState)

  // Respond to the dialog closing
  const onPrivacyClose = (canceled, newPrivacy) => {
    // Dismiss the privacy activity
    popActivity(ACTIVITIES.PRIVACY_PROMPT.key)

    if (!canceled) {
      // Update affect and privacy
      setCurrentAffect(lastSelectedAffectID)
      setPrivacy(newPrivacy)

      // Dismiss affect survey too
      popActivity(ACTIVITIES.AFFECT_SURVEY.key)
    }
  }

  return (
    <PrivacyPromptComponent privacyCallback={onPrivacyClose} />
  )
}
