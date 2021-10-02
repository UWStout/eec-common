import React from 'react'

import { useSetRecoilState } from 'recoil'
import { PopConnectActivityState } from '../../data/globalSate/connectActivityState.js'

import AffectConfirmComponent from '../../AffectSurvey/AffectConfirmComponent.jsx'

import { ACTIVITIES } from './Activities.js'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Affect Confirm Connect Activity', 'yellow', 'black')

export default function AffectConfirmActivity (props) {
  // Global activity states
  const popActivity = useSetRecoilState(PopConnectActivityState)

  // Respond to the dialog closing
  const onClose = () => {
    // Dismiss this activity
    popActivity(ACTIVITIES.AFFECT_CONFIRM.key)

    // Dismiss the privacy activity (might fail, but will do so gracefully)
    popActivity(ACTIVITIES.PRIVACY_PROMPT.key)

    // Dismiss the affect survey
    popActivity(ACTIVITIES.AFFECT_SURVEY.key)
  }

  return (
    <AffectConfirmComponent closeCallback={onClose} />
  )
}
