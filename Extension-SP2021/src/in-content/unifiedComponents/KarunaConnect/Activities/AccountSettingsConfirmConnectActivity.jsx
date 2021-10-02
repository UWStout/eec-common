import React from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ConnectActivityStackState, PopConnectActivityState } from '../../data/globalSate/connectActivityState.js'

import AccountSettingsConfirmComponent from '../../Settings/AccountSettingsConfirmComponent.jsx'

import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('Account Settings Confirm Connect Activity', 'yellow', 'black')

export default function AccountSettingsConfirmConnectActivity (props) {
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
    <AccountSettingsConfirmComponent closeCallback={onClose} />
  )
}
