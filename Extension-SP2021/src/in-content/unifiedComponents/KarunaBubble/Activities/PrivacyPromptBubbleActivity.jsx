import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter, UserAffectIDState } from '../../data/globalSate/userState.js'
import { LastSelectedAffectIDState } from '../../data/globalSate/appState.js'
import { PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'

import PrivacyPromptComponent from '../../AffectSurvey/PrivacyPromptComponent.jsx'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Privacy Bubble Activity', 'yellow', 'black')

export default function PrivacyPromptBubbleActivity (props) {
  const { requestHide, cancelHide, allowNext, isOnboarding } = props

  // Global data states
  const setPrivacy = useSetRecoilState(PrivacyPrefsStateSetter)
  const setCurrentAffect = useSetRecoilState(UserAffectIDState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const popActivity = useSetRecoilState(PopBubbleActivityState)

  useEffect(() => {
    if (isOnboarding && allowNext) { allowNext(false) }
  }, [allowNext, isOnboarding])

  // Respond to the dialog closing
  const onPrivacyClose = (canceled, newPrivacy) => {
    if (isOnboarding) {
      // Update affect and privacy
      setCurrentAffect(lastSelectedAffectID)
      setPrivacy(newPrivacy)
      if (allowNext) { allowNext(true) }
    } else {
      // Dismiss the privacy activity
      popActivity(ACTIVITIES.PRIVACY_PROMPT)

      if (!canceled) {
        // Update affect and privacy
        setCurrentAffect(lastSelectedAffectID)
        setPrivacy(newPrivacy)

        // Dismiss affect survey too
        popActivity(ACTIVITIES.AFFECT_SURVEY)
      }
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
