import React from 'react'
import PropTypes from 'prop-types'

import { useSetRecoilState } from 'recoil'
import { PushActivityState, PopActivityState } from '../../data/globalSate/appState.js'
import { UserAffectIDState } from '../../data/globalSate/userState.js'

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
  const setUserAffectID = useSetRecoilState(UserAffectIDState)

  // Global activity management
  const pushActivity = useSetRecoilState(PushActivityState)
  const popActivity = useSetRecoilState(PopActivityState)

  // Called when the user clicks on an affect. May:
  // - Show the privacy preferences prompt
  // - Fully commit and update mood
  const onSelection = (affect, affectPrivacy) => {
    if (affectPrivacy.prompt) {
      pushActivity(ACTIVITIES.PRIVACY_PROMPT.key)
    } else {
      setUserAffectID(affect?._id)
      popActivity(ACTIVITIES.AFFECT_SURVEY.key)
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
