import React from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectActivityStackState, PopConnectActivityState } from '../../data/globalSate/connectActivityState.js'

import AffectConfirmComponent from '../../AffectSurvey/AffectConfirmComponent.jsx'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Affect Confirm Connect Activity', 'yellow', 'black')

export default function AffectConfirmConnectActivity (props) {
  // Global activity states
  const activityStack = useRecoilValue(ConnectActivityStackState)
  const popActivity = useSetRecoilState(PopConnectActivityState)

  // Respond to the dialog closing
  const onClose = () => {
    // Work backwards and pop all activities except the last one
    for (let i = activityStack.length - 1; i > 0; i--) {
      popActivity(activityStack[i])
    }
  }

  return (
    <AffectConfirmComponent closeCallback={onClose} />
  )
}
