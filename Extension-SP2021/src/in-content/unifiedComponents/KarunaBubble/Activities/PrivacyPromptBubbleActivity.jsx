import React from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { PrivacyPrefsStateSetter, UserAffectIDState } from '../../data/globalSate/userState.js'
import { LastSelectedAffectIDState } from '../../data/globalSate/appState.js'
import { PopBubbleActivityState } from '../../data/globalSate/bubbleActivityState.js'

import PrivacyPromptComponent from '../../AffectSurvey/PrivacyPromptComponent.jsx'

import { ACTIVITIES } from './Activities.js'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Privacy Bubble Activity', 'yellow', 'black')

export default function PrivacyPromptBubbleActivity (props) {
  const { requestHide, cancelHide } = props

  // Global data states
  const setPrivacy = useSetRecoilState(PrivacyPrefsStateSetter)
  const setCurrentAffect = useSetRecoilState(UserAffectIDState)
  const lastSelectedAffectID = useRecoilValue(LastSelectedAffectIDState)

  // Global activity states
  const popActivity = useSetRecoilState(PopBubbleActivityState)

  // Respond to the dialog closing
  const onPrivacyClose = (canceled, newPrivacy) => {
    // Dismiss the privacy activity
    popActivity(ACTIVITIES.PRIVACY_PROMPT)

    if (!canceled) {
      // Update affect and privacy
      setCurrentAffect(lastSelectedAffectID)
      LOG('Setting privacy to', newPrivacy)
      setPrivacy(newPrivacy)

      // Dismiss affect survey too
      popActivity(ACTIVITIES.AFFECT_SURVEY)
    }
  }

  return (
    <div onMouseEnter={cancelHide} onMouseLeave={() => requestHide && requestHide(false)}>
      <PrivacyPromptComponent privacyCallback={onPrivacyClose} />
    </div>
  )
}

PrivacyPromptBubbleActivity.propTypes = {
  requestHide: PropTypes.func,
  cancelHide: PropTypes.func
}

PrivacyPromptBubbleActivity.defaultProps = {
  requestHide: null,
  cancelHide: null
}
