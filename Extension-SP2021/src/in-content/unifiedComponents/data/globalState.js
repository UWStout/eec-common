import { atom, selector } from 'recoil'

import * as HELPER from './backgroundHelper.js'

// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('RECOIL Global State', '#27213C', '#EEF4ED')

// CAUTION: This must be set once early in the lifecycle of the
// UnifiedApp and cannot change
let MSG_CONTEXT = 'unknown'
export const setMessagingContext = (context) => {
  MSG_CONTEXT = context
}

/** Is the connect panel open and visible */
export const ConnectVisibilityState = atom({
  key: 'ConnectVisibilityState',
  default: false
})

/** Is the Bubble feedback dialog open and visible */
export const BubbleVisibilityState = atom({
  key: 'BubbleVisibilityState',
  default: false
})

/** Basic info for current user */
export const LoggedInUserState = atom({
  key: 'LoggedInUserState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveBasicUserInfo())

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Logged in user updated', newVal)
      })
    }
  ]
})

/** Simple global state to check if the user is logged in */
export const ValidUserState = selector({
  key: 'ValidUserState',
  get: ({ get }) => {
    const userState = get(LoggedInUserState)
    return (userState?.id !== undefined)
  }
})
