import React from 'react'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { UserAffectInfoState } from '../../data/globalSate/userState.js'
import { LastSelectedAffectIDState } from '../../data/globalSate/appState.js'
import { PushConnectActivityState } from '../../data/globalSate/connectActivityState.js'
import { KarunaSettingsState, KarunaSettingsSyncState } from '../../data/globalSate/settingsState.js'

import PrivacyPromptComponent from '../../AffectSurvey/PrivacyPromptComponent.jsx'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Privacy Connect Activity', 'yellow', 'black')

export default function PrivacyPromptConnectActivity (props) {
  // Global data states
  const setKarunaSettings = useSetRecoilState(KarunaSettingsSyncState)
  const karunaSettings = useRecoilValue(KarunaSettingsState)
  const setAffectInfo = useSetRecoilState(UserAffectInfoState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const pushActivity = useSetRecoilState(PushConnectActivityState)

  // Respond to the dialog closing
  const onPrivacyClose = (alwaysShare, enablePrivacyPrompt) => {
    // Update affect and privacy
    setAffectInfo({
      affectID: lastSelectedAffectID,
      affectPrivacy: !alwaysShare
    })
    setKarunaSettings({
      ...karunaSettings,
      enablePrivacyPrompt,
      alwaysShare
    })

    // Show confirmation
    pushActivity(ACTIVITIES.AFFECT_CONFIRM.key)
  }

  return (
    <PrivacyPromptComponent privacyCallback={onPrivacyClose} />
  )
}
