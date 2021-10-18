import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { UserAffectInfoState } from '../../data/globalSate/userState.js'
import { LastSelectedAffectIDState } from '../../data/globalSate/appState.js'
import { PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'
import { KarunaSettingsState, KarunaSettingsSyncState } from '../../data/globalSate/settingsState.js'

import PrivacyPromptComponent from '../../AffectSurvey/PrivacyPromptComponent.jsx'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Privacy Bubble Activity', 'yellow', 'black')

export default function PrivacyPromptBubbleActivity (props) {
  const { requestHide, cancelHide, allowNext, isOnboarding } = props

  // Global data states
  const setKarunaSettings = useSetRecoilState(KarunaSettingsSyncState)
  const karunaSettings = useRecoilValue(KarunaSettingsState)
  const setAffectInfo = useSetRecoilState(UserAffectInfoState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const popActivity = useSetRecoilState(PopBubbleActivityState)

  useEffect(() => {
    if (isOnboarding && allowNext) { allowNext(false) }
  }, [allowNext, isOnboarding])

  // Respond to the dialog closing
  const onPrivacyClose = (alwaysShare, enablePrivacyPrompt) => {
    if (isOnboarding) {
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
      if (allowNext) { allowNext(true) }
    } else {
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

      // Dismiss privacy and affect survey activities
      popActivity(ACTIVITIES.PRIVACY_PROMPT)
      popActivity(ACTIVITIES.AFFECT_SURVEY)
    }
  }

  return (
    <div onMouseOver={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <PrivacyPromptComponent privacyCallback={onPrivacyClose} noOptOut />
    </div>
  )
}

PrivacyPromptBubbleActivity.propTypes = {
  isOnboarding: PropTypes.bool,
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func,
  allowNext: PropTypes.func
}

PrivacyPromptBubbleActivity.defaultProps = {
  isOnboarding: false,
  requestHide: null,
  cancelHide: null,
  allowNext: null
}
