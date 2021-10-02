import React from 'react'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter, UserAffectIDState } from '../../data/globalSate/userState.js'
import { LastSelectedAffectIDState } from '../../data/globalSate/appState.js'
import { PopConnectActivityState, PushConnectActivityState } from '../../data/globalSate/connectActivityState.js'

import PrivacyPromptComponent from '../../AffectSurvey/PrivacyPromptComponent.jsx'

import { ACTIVITIES } from './Activities.js'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Privacy Connect Activity', 'yellow', 'black')

export default function PrivacyPromptConnectActivity (props) {
  // Global data states
  const setPrivacy = useSetRecoilState(PrivacyPrefsStateSetter)
  const setCurrentAffect = useSetRecoilState(UserAffectIDState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const popActivity = useSetRecoilState(PopConnectActivityState)
  const pushActivity = useSetRecoilState(PushConnectActivityState)

  // Respond to the dialog closing
  const onPrivacyClose = (canceled, newPrivacy) => {
    if (!canceled) {
      // Update affect and privacy
      setCurrentAffect(lastSelectedAffectID)
      setPrivacy(newPrivacy)

      // Show confirmation
      LOG('Pushing confirm activity from privacy prompt')
      pushActivity(ACTIVITIES.AFFECT_CONFIRM.key)
    } else {
      popActivity(ACTIVITIES.PRIVACY_PROMPT.key)
    }
  }

  return (
    <PrivacyPromptComponent privacyCallback={onPrivacyClose} />
  )
}
