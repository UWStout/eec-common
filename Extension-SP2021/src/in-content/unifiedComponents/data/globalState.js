import { atom, selector } from 'recoil'

import * as HELPER from './backgroundHelper.js'

// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('RECOIL Global State', '#27213C', '#EEF4ED')

// CAUTION: This must be set once early in the lifecycle of the
// UnifiedApp and cannot change (currently set in 'in-context.js')
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

/** Privacy preferences data for sharing mood */
export const PrivacyPrefsState = atom({
  key: 'PrivacyPrefsState',
  default: {
    private: true,
    prompt: true
  },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveMoodPrivacy(MSG_CONTEXT))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Logged in user updated', newVal)
      })
    }
  ]
})

/** Selector to set Privacy Preferences (with side-effects) */
export const PrivacyPrefsStateSetter = selector({
  key: 'PrivacyPrefsStateSetter',
  get: ({ get }) => {
    return get(PrivacyPrefsState)
  },

  set: ({ set }, newPrivacy) => {
    // Update local cached state
    set(PrivacyPrefsState, { ...newPrivacy })

    // Send to the database
    HELPER.setMoodPrivacy(newPrivacy, MSG_CONTEXT)
  }
})

/** List of available affects/emojis */
export const AffectListState = atom({
  key: 'AffectListState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveAffectList(MSG_CONTEXT))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Affect list updated', newVal)
      })
    }
  ]
})

/** Global state for the affect/emoji list */
export const EmojiListState = selector({
  key: 'EmojiListState',
  get: ({ get }) => {
    const affectList = get(AffectListState)
    return affectList
  },
  set: ({ set }) => {
    // TODO: Implement
  }
})

/** List of user's recent emoji */
export const AffectHistoryListState = atom({
  key: 'AffectHistoryListState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveAffectHistoryList(MSG_CONTEXT))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Affect history list updated', newVal)
      })
    }
  ]
})

/** Most recent user status */
export const UserStatusState = atom({
  key: 'UserStatusState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveUserStatus(MSG_CONTEXT))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('User status updated', newVal)
      })
    }
  ]
})

/** Global state for the user's mood/affect */
export const UserAffectIDState = selector({
  key: 'UserAffectIDState',
  get: ({ get }) => {
    const currentStatus = get(UserStatusState)
    return currentStatus.currentAffectID
  },

  set: ({ get, set }, newAffectID) => {
    // Update local cached state
    const currentStatus = get(UserStatusState)
    set(UserStatusState, {
      ...currentStatus,
      currentAffectID: newAffectID
    })

    // Send to the database (TODO: fix hard-coded privacy)
    HELPER.setCurrentAffect(newAffectID, false, MSG_CONTEXT)
  }
})

/** Global state for the user's collaboration status */
export const UserCollaborationState = selector({
  key: 'UserCollaborationState',
  get: ({ get }) => {
    const currentStatus = get(UserStatusState)
    return (currentStatus.collaboration)
  },

  set: ({ get, set }, newCollaboration) => {
    // Update local cached state
    const currentStatus = get(UserStatusState)
    set(UserStatusState, {
      ...currentStatus,
      collaboration: newCollaboration
    })

    // Send to the database
    HELPER.setCurrentCollaboration(newCollaboration, MSG_CONTEXT)
  }
})

/** Global state for the user's "time to respond" */
export const TimeToRespondState = selector({
  key: 'TimeToRespondState',
  get: ({ get }) => {
    const currentStatus = get(UserStatusState)
    return (currentStatus.timeToRespond)
  },

  set: ({ get, set }, newTimeToRespond) => {
    // Update local cached state
    const currentStatus = get(UserStatusState)
    set(UserStatusState, {
      ...currentStatus,
      timeToRespond: newTimeToRespond
    })

    // Send to the database
    HELPER.setTimeToRespond(newTimeToRespond, MSG_CONTEXT)
  }
})
