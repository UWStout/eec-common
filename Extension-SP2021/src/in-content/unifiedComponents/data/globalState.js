import { atom, selector } from 'recoil'

import * as HELPER from './backgroundHelper.js'
import { ACTIVITIES } from '../Activities/Activities.js'

// Colorful logger
import { makeLogger } from '../../../util/Logger.js'
const LOG = makeLogger('RECOIL Global State', '#27213C', '#EEF4ED')

// CAUTION: This must be set once early in the lifecycle of the
// UnifiedApp and cannot change (currently set in 'in-context.js')
let MSG_CONTEXT = 'unknown'
export const setMessagingContext = (context) => {
  MSG_CONTEXT = context
}

/** The Messaging context (e.g. the communication tool in use) */
export const MessagingContextState = atom({
  key: 'MessagingContextState',
  default: 'unknown',
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Messaging context updated', newVal)
      })
    }
  ]
})

/** Is the connect panel open and visible */
export const ConnectVisibilityState = atom({
  key: 'ConnectVisibilityState',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Connect panel visibility updated', newVal)
      })
    }
  ]
})

/** Is the Bubble feedback dialog open and visible */
export const BubbleVisibilityState = atom({
  key: 'BubbleVisibilityState',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Bubble visibility updated', newVal)
      })
    }
  ]
})

export const BubbleVisibilityStateSetter = selector({
  key: 'BubbleVisibilityStateSetter',
  get: ({ get }) => {
    return get(BubbleVisibilityState)
  },

  set: ({ set }, isVisible) => {
    // Update local cached state
    set(BubbleVisibilityState, isVisible)
  }
})

/** What activity is displayed on the karuna bubble feedback dialog */
export const BubbleDisplayedFeedbackState = atom({
  key: 'BubbleDisplayedFeedbackState',
  default: 'none',
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Bubble displayed feedback updated', newVal)
      })
    }
  ]
})

/** The trail of activities clicked through in the connect panel */
export const ActivityStackState = atom({
  key: 'ActivityStackState',
  default: [ACTIVITIES.LOGIN.key],
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Activity stack updated', newVal)
      })
    }
  ]
})

/** Add an activity to the stack */
export const PushActivityState = selector({
  key: 'PushActivityState',
  get: ({ get }) => {
    const activityStack = get(ActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty activity stack')
      return ''
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, newActivity) => {
    const activityStack = get(ActivityStackState)
    if (activityStack.includes(newActivity)) {
      LOG.error(`Activity "${newActivity}" already in stack`)
    } else {
      set(ActivityStackState, [...activityStack, newActivity])
    }
  }
})

/** Remove activity from top of stack */
export const PopActivityState = selector({
  key: 'PopActivityState',
  get: ({ get }) => {
    const activityStack = get(ActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty activity stack')
      return ''
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, activityToPop) => {
    const activityStack = get(ActivityStackState)
    if (activityStack.length > 1) {
      const currentActivity = activityStack[activityStack.length - 1]
      if (currentActivity !== activityToPop) {
        LOG.error(`Current activity (${currentActivity}) does not match pop request (${activityToPop})`)
      } else {
        set(ActivityStackState, activityStack.slice(0, -1))
      }
    } else {
      LOG.error('Refusing to remove the last activity (prevented stack underflow)')
    }
  }
})

/** Has the user selected a new mood in the affect survey */
export const LastSelectedAffectIDState = atom({
  key: 'LastSelectedAffectIDState',
  default: '',
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Last selected Affect ID updated', newVal)
      })
    }
  ]
})

export const NVCIdentifiedState = atom({
  key: 'NVCIdentifiedState',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('NVC Identified State updated', newVal)
      })
    }
  ]
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

// Assigning IDs to text boxes
let idCounter = 0
function generateTextBoxID () {
  idCounter++
  return idCounter
}

/** Text boxes we are monitoring */
export const TextBoxMapState = atom({
  key: 'TextBoxMapState',
  default: new Map(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Text Box Map State updated', newVal)
      })
    }
  ]
})

export const TextBoxListState = selector({
  key: 'TextBoxListState',
  get: ({ get }) => {
    const textBoxMap = get(TextBoxMapState)
    return Array.from(textBoxMap.values())
  },
  set: ({ get, set }, newTextBoxList) => {
    // Compare with old map of text boxes
    const textBoxMap = get(TextBoxMapState)

    // Examine the text boxes
    const newTextBoxMap = new Map()
    let textBoxesChanged = false
    newTextBoxList.forEach((textBox) => {
      // Ensure each text box has a unique ID
      if (textBox.id === undefined || textBox.id === '') {
        textBox.id = `karunaTextBox-${generateTextBoxID()}`
        LOG(`New Text Box: ${textBox.id}`)
      }

      // Check if ID is new
      if (!textBoxMap.has(textBox.id)) {
        LOG('Foreign Text Box: ', textBox.id)
        textBoxesChanged = true
      }
      newTextBoxMap.set(textBox.id, textBox)
    })

    // If something is different, update the atom
    if (textBoxesChanged || newTextBoxMap.size !== textBoxMap.size) {
      LOG('Text Boxes Changed', newTextBoxMap.keys())
      LOG(`>   ${newTextBoxMap.size} !== ${textBoxMap.size}`)
      LOG(`Lists are ${textBoxMap === newTextBoxMap ? 'equal' : 'NOT equal'}`)
      set(TextBoxMapState, newTextBoxMap)
    }
  }
})

/** Latest message from Karuna server */
export const KarunaMessageQueueState = atom({
  key: 'KarunaMessageQueueState',
  default: [],
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Karuna Message Queue State updated', newVal)
      })
    }
  ]
})

/** Latest message from Karuna server */
export const ActiveKarunaMessageState = atom({
  key: 'ActiveKarunaMessageState',
  default: null,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Active Karuna Message State updated', newVal)
      })
    }
  ]
})

/** Latest message from Karuna server */
export const KarunaMessageEnqueueState = selector({
  key: 'KarunaMessageEnqueueState',

  /** Get message queue */
  get: ({ get }) => {
    return get(KarunaMessageQueueState)
  },

  /** Enqueue a new message */
  set: ({ get, set }, newMessage) => {
    const messageQueue = get(KarunaMessageQueueState)
    if (!Array.isArray(messageQueue) || messageQueue.length < 1) {
      set(KarunaMessageQueueState, [newMessage])
    } else {
      if (messageQueue[0].isWatson && newMessage.isWatson) {
        // Coalesce watson messages
        set(KarunaMessageQueueState, [newMessage, ...messageQueue.slice(1, messageQueue.length)])
      } else {
        set(KarunaMessageQueueState, [newMessage, ...messageQueue])
      }
    }
  }
})

/** Latest message from Karuna server */
export const KarunaMessageDequeueState = selector({
  key: 'KarunaMessageDequeueState',

  /** Get message queue */
  get: ({ get }) => {
    return get(KarunaMessageQueueState)
  },

  /** Remove next message in queue and set it as the Active message */
  set: ({ get, set }) => {
    const messageQueue = get(KarunaMessageQueueState)
    if (Array.isArray(messageQueue) && messageQueue.length > 0) {
      const newActiveMessage = messageQueue[messageQueue.length - 1]
      set(KarunaMessageQueueState, messageQueue.slice(0, -1))
      set(ActiveKarunaMessageState, newActiveMessage)
    }
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

export const toggleDeleteState = atom({
  key: 'Toggle',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('toggle delete state updated', newVal)
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
    const isDelete = get(toggleDeleteState)
    let favoriteList = get(FavoriteAffectsListState)
    if (isDelete) {
      favoriteList = favoriteList.filter((emoji) => (
        emoji !== favorite
      ))
      set(FavoriteAffectsListState, favoriteList)
      // Send to the database
      HELPER.removeFavoriteAffect(favorite, MSG_CONTEXT)
    } else {
      set(FavoriteAffectsListState, [favorite, ...favoriteList])

      // Send to the database
      HELPER.setFavoriteAffect(favorite, MSG_CONTEXT)
    }
  }
})

/** List of  user's Disabled emojis */
export const DisabledAffectsListState = selector({
  key: 'DisabledAffectsListState',
  get: async ({ get }) => {
    const activeTeamID = get(ActiveTeamIDState)
    try {
      const disabledAffects = await HELPER.retrieveTeamDisabledAffectsList(activeTeamID, MSG_CONTEXT)
      return disabledAffects
    } catch (err) {
      LOG.error(`Failed to retrieve teammates info with status for team "${activeTeamID}"`)
      LOG.error(err)
      return []
    }
  },

  set: ({ set, get }, disabled) => {
    // Update local cached state
    const isDelete = get(toggleDeleteState)
    let disabledList = get(DisabledAffectsListState)
    if (isDelete) {
      disabledList = disabledList.filter((emoji) => (
        emoji !== disabled
      ))
      set(DisabledAffectsListState, disabledList)
      // Send to the database
      HELPER.removeTeamDisabledAffect(disabled, MSG_CONTEXT)
    } else {
      set(DisabledAffectsListState, [disabled, ...disabledList])

      // Send to the database
      HELPER.setTeamDisabledAffect(disabled, MSG_CONTEXT)
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
      setSelf(HELPER.retrieveUserStatus(MSG_CONTEXT))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('User status updated', newVal)
      })
    }
  ]
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

/** Currently Active Team (TODO: Make this an array of ALL active teams) */
export const ActiveTeamIDState = selector({
  key: 'ActiveTeamIDState',
  get: ({ get }) => {
    const userInfo = get(LoggedInUserState)
    return userInfo?.activeTeam || ''
  }
})

/** Most recent teammates basic user info */
export const TeammatesUserInfoState = selector({
  key: 'TeammatesUserInfoState',
  get: async ({ get }) => {
    const activeTeamID = get(ActiveTeamIDState)
    try {
      const teammatesInfo = await HELPER.retrieveTeamUserInfoAndStatus(activeTeamID, MSG_CONTEXT)
      return teammatesInfo
    } catch (err) {
      LOG.error(`Failed to retrieve teammates info with status for team "${activeTeamID}"`)
      LOG.error(err)
      return []
    }
  }
})

/** Most recent teammates basic user info */
export const TeamAffectTemperature = selector({
  key: 'TeamAffectTemperature',
  get: async ({ get }) => {
    const activeTeamID = get(ActiveTeamIDState)
    try {
      const teamTemperature = await HELPER.retrieveTeamAffectTemperature(activeTeamID, MSG_CONTEXT)
      return teamTemperature
    } catch (err) {
      LOG.error(`Failed to retrieve team affect temperature for team "${activeTeamID}"`)
      LOG.error(err)
      return 'N/A'
    }
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
    HELPER.setCurrentAffect(newAffectID, false, MSG_CONTEXT)
    get(TeamAffectTemperature)
  }
})
