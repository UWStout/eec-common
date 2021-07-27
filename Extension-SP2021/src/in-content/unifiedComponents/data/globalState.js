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

/** Has the user selected a new mood in the affect survey */
export const SelectedAffectSurveyState = atom({
  key: 'SelectedAffectSurveyState',
  default: ''
})

export const NVCIdentifiedState = atom({
  key: 'NVCIdentifiedState',
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

// Assigning IDs to text boxes
let idCounter = 0
function generateTextBoxID () {
  idCounter++
  return idCounter
}

/** Text boxes we are monitoring */
export const TextBoxMapState = atom({
  key: 'TextBoxMapState',
  default: new Map()
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
      // Ensure each textbox has a unique ID
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

/*
(incomingTextBoxes) => {
  // Examine the text boxes
  const newTextBoxList = new Map()
  let textBoxesChanged = false
  incomingTextBoxes.forEach((textBox) => {
    // Ensure each textbox has a unique ID
    if (textBox.id === undefined || textBox.id === '') {
      textBox.id = `karunaTextBox-${generateID()}`
      LOG(`New Text Box: ${textBox.id}`)
    }

    // Check if ID is new
    if (!textBoxList.has(textBox.id)) {
      LOG('Foreign Text Box: ', textBox.id)
      textBoxesChanged = true
    }
    newTextBoxList.set(textBox.id, textBox)
  })

  if (textBoxesChanged || newTextBoxList.size !== textBoxList.size) {
    LOG('Text Boxes Changed', newTextBoxList.keys())
    LOG(`>   ${newTextBoxList.size} !== ${textBoxList.size}`)
    LOG(`Lists are ${textBoxList === newTextBoxList ? 'equal' : 'NOT equal'}`)
    setTextBoxList(newTextBoxList)
  }
})
*/

/** Latest message from Karuna server */
export const KarunaMessageState = atom({
  key: 'KarunaMessageState',
  default: { }
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
