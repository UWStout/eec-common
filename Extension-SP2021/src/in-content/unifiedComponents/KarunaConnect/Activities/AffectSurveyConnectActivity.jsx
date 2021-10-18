import React from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { PushConnectActivityState } from '../../data/globalSate/connectActivityState.js'
import { UserAffectInfoState } from '../../data/globalSate/userState.js'

import AffectSurveyComponent from '../../AffectSurvey/AffectSurveyComponent.jsx'

import { ACTIVITIES } from './Activities.js'

// import { makeLogger } from '../../../../util/Logger.js'
// const LOG = makeLogger('Affect Survey Activity', 'pink', 'black')

/**
 * Manage the affect survey when shown in the connect panel
 **/
const AffectSurveyConnectActivity = React.forwardRef((props, ref) => {
  // Deconstruct the props
  const { noInteraction } = props

  // Values and mutator functions for global state (GLOBAL STATE)
  const setUserAffectInfo = useSetRecoilState(UserAffectInfoState)

  // Global activity management
  const pushActivity = useSetRecoilState(PushConnectActivityState)

  // Called when the user clicks on an affect. May:
  // - Show the privacy preferences prompt
  // - Fully commit and update mood
  const onSelection = (affect, karunaSettings) => {
    if (karunaSettings.enablePrivacyPrompt) {
      pushActivity(ACTIVITIES.PRIVACY_PROMPT.key)
    } else {
      setUserAffectInfo({ affectID: affect?._id, affectPrivacy: !karunaSettings.alwaysShare })
      pushActivity(ACTIVITIES.AFFECT_CONFIRM.key)
    }
  }

  // Show affect survey
  return (
    <AffectSurveyComponent noInteraction={noInteraction} selectionCallback={onSelection} ref={ref} />
  )
})

AffectSurveyConnectActivity.displayName = 'AffectSurveyActivity'

AffectSurveyConnectActivity.propTypes = {
  noInteraction: PropTypes.bool
}

AffectSurveyConnectActivity.defaultProps = {
  noInteraction: false
}

export default AffectSurveyConnectActivity
