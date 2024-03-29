import { atom, selector } from 'recoil'

import * as HELPER from '../backgroundHelper.js'
import { getMessagingContext } from './appState.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL User State', '#27213C', '#EEF4ED')

/** Basic info for current user (from token only) */
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

/** Extended info for current user (from database) */
export const FullUserState = selector({
  key: 'FullUserState',
  get: async ({ get }) => {
    const userState = get(LoggedInUserState)
    if (userState?.id) {
      try {
        const extendedInfo = await HELPER.retrieveExtendedUserInfo(userState?.id)
        return extendedInfo
      } catch (err) {
        LOG.error('Failed to retrieve extended user info')
        LOG.error(err)
        return null
      }
    } else {
      return null
    }
  }
})

/** Simple global state to check if the user is logged in */
export const ValidUserState = selector({
  key: 'ValidUserState',
  get: ({ get }) => {
    const userState = get(LoggedInUserState)
    return (userState?.id !== undefined)
  }
})

/** Customizable karuna settings for the current user */
// export const KarunaSettingsState = selector({
//   key: 'KarunaSettingsStateSetter',

//   get: async ({ get }) => {
//     const validUser = get(ValidUserState)
//     if (validUser) {
//       try {
//         const karunaSettings = await HELPER.retrieveKarunaSettings()
//         return karunaSettings
//       } catch (err) {
//         LOG.error('Failed to retrieve user\'s karuna settings')
//         LOG.error(err)
//         return null
//       }
//     } else {
//       return null
//     }
//   },

//   set: ({ get, set }, newSettings) => {
//     const validUser = get(ValidUserState)
//     if (validUser) {
//       try {
//         HELPER.updateKarunaSettings(newSettings)
//       } catch (err) {
//         LOG.error('Failed to update user\'s karuna settings')
//         LOG.error(err)
//       }
//     } else {
//       LOG.error('Can\'t update karuna settings when not logged in')
//     }
//   }
// })

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
  key: 'ToggleFavoriteDeleteState',
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
export const UserAffectInfoState = selector({
  key: 'UserAffectInfoState',
  get: ({ get }) => {
    const currentStatus = get(UserStatusState)
    return {
      affectID: currentStatus?.currentAffectID,
      affectPrivacy: currentStatus?.currentAffectPrivacy
    }
  },

  set: ({ get, set }, { affectID, affectPrivacy }) => {
    // Update local cached state
    const currentStatus = get(UserStatusState)
    set(UserStatusState, {
      ...currentStatus,
      currentAffectID: affectID,
      currentAffectPrivacy: affectPrivacy
    })

    // Send to the database
    HELPER.setCurrentAffect(affectID, affectPrivacy, getMessagingContext())
  }
})

/** Atom for locally cached alias to userId lookup info */
export const CachedAliasListState = atom({
  key: 'CachedAliasListState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      setSelf(HELPER.retrieveCachedAliasInfo())

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Cached Alias Info updated', newVal)
      })
    }
  ]
})

/** Selector for creating alias to userId lookup data and updating it */
export const AliasListState = selector({
  key: 'AliasListState',
  get: async ({ get }) => {
    const cachedList = get(CachedAliasListState)
    return cachedList
  },
  set: async ({ get, set }, newAliasList) => {
    if (!Array.isArray(newAliasList)) {
      newAliasList = [newAliasList]
    }

    // Compare cached aliases with requested ones
    const cachedList = get(CachedAliasListState)
    const missingAliasList = []
    newAliasList.forEach((alias) => {
      if (cachedList[alias] === undefined) {
        missingAliasList.push(alias)
      }
    })

    // Do we need to lookup any new aliases
    if (missingAliasList.length > 0) {
      try {
        // Retrieve just the new aliases
        const newEntries = await HELPER.retrieveAliasLookupInfo(getMessagingContext(), missingAliasList)

        // Combine new entries with cache
        const combinedCache = { ...cachedList, ...newEntries }

        // Update cache and return combined list
        await HELPER.updateCachedAliasInfo(combinedCache)
        set(CachedAliasListState, combinedCache)
        return combinedCache
      } catch (err) {
        // Log the error and let execution fall through
        LOG.error('Failed to update alias list:', err)
      }
    }

    // In all other cases, just return the cached list
    return cachedList
  }
})
