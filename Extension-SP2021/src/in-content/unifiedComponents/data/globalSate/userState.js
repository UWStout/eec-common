import { atom, selector } from 'recoil'

import * as HELPER from '../backgroundHelper.js'
import { getMessagingContext } from './appState.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL User State', '#27213C', '#EEF4ED')

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

/** List of user's recent emoji */
export const AffectHistoryListState = atom({
  key: 'AffectHistoryListState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveAffectHistoryList(getMessagingContext()))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Affect history list updated', newVal)
      })
    }
  ]
})

/** List of  user's favorite emojis */
export const FavoriteAffectsListState = atom({
  key: 'FavoriteAffectsListState',
  default: [],
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveFavoriteAffectsList())

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Favorite affects updated', newVal)
      })
    }
  ]
})

export const ToggleFavoriteDeleteState = atom({
  key: 'ToggleDeleteState',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('toggle favorite delete state updated', newVal)
      })
    }
  ]
})

/** Selector to set Favorite affects (with side-effects) */
export const FavoriteAffectsListStateSetter = selector({
  key: 'FavoriteAffectsListStateSetter',
  get: ({ get }) => {
    return get(FavoriteAffectsListState)
  },

  set: ({ set, get }, favorite) => {
    // Update local cached state
    const isDelete = get(ToggleFavoriteDeleteState)
    let favoriteList = get(FavoriteAffectsListState)
    if (isDelete) {
      favoriteList = favoriteList.filter((emoji) => (
        emoji !== favorite
      ))
      set(FavoriteAffectsListState, favoriteList)
      // Send to the database
      HELPER.removeFavoriteAffect(favorite, getMessagingContext())
    } else {
      set(FavoriteAffectsListState, [favorite, ...favoriteList])

      // Send to the database
      HELPER.setFavoriteAffect(favorite, getMessagingContext())
    }
  }
})

/** Most recent user status */
export const UserStatusState = atom({
  key: 'UserStatusState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveUserStatus(getMessagingContext()))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('User status updated', newVal)
      })
    }
  ]
})

/** User's team list */
export const UserTeamsState = selector({
  key: 'UserTeamsState',
  get: async ({ get }) => {
    const userInfo = get(LoggedInUserState)
    if (userInfo.id) {
      try {
        const teams = await HELPER.retrieveUserTeams(getMessagingContext())
        return teams
      } catch (err) {
        LOG.error('Failed to retrieve teams')
        LOG.error(err)
      }
    } else {
      LOG('No User id to retrieve teams')
    }
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
    HELPER.setCurrentCollaboration(newCollaboration, getMessagingContext())
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
    HELPER.setTimeToRespond(newTimeToRespond, getMessagingContext())
  }
})

/** Global state for the user's mood/affect */
export const UserAffectIDState = selector({
  key: 'UserAffectIDState',
  get: ({ get }) => {
    const currentStatus = get(UserStatusState)
    return currentStatus?.currentAffectID
  },

  set: ({ get, set }, newAffectID) => {
    // Update local cached state
    const currentStatus = get(UserStatusState)
    set(UserStatusState, {
      ...currentStatus,
      currentAffectID: newAffectID
    })

    // Send to the database (TODO: fix hard-coded privacy)
    HELPER.setCurrentAffect(newAffectID, false, getMessagingContext())
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
      setSelf(HELPER.retrieveMoodPrivacy(getMessagingContext()))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Privacy preferences updated', newVal)
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
    HELPER.setMoodPrivacy(newPrivacy, getMessagingContext())
  }
})
