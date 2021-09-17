import { atom, selector } from 'recoil'

import { ACTIVITIES } from '../../KarunaConnect/Activities/Activities.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL App State', '#27213C', '#EEF4ED')

// CAUTION: This must be set once early in the lifecycle of the
// UnifiedApp and cannot change (currently set in 'in-context.js')
let MSG_CONTEXT = 'unknown'
export const setMessagingContext = (context) => {
  MSG_CONTEXT = context
}

export const getMessagingContext = () => {
  return MSG_CONTEXT
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

/** Should all panel input be disabled (to prevent focusing) */
export const DisableInputState = atom({
  key: 'DisableInputState',
  default: true
})

/** Track which TextField input is focused (if any) */
export const ActiveInputRefState = atom({
  key: 'ActiveInputRefState',
  default: null,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Active Input Ref updated', newVal)
      })
    }
  ]
})

/** Track which TextField input is focused (if any) */
export const TypeToActiveInputState = selector({
  key: 'TypeToActiveInputState',
  get: ({ get }) => {
    const inputRefObject = get(ActiveInputRefState)
    return inputRefObject?.inputRef?.current
  },
  set: ({ get, set }, keyChar) => {
    const inputRefObject = get(ActiveInputRefState)
    if (inputRefObject?.append) {
      inputRefObject.append(keyChar)
    }
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
      }

      // Check if ID is new
      if (!textBoxMap.has(textBox.id)) {
        textBoxesChanged = true
      }
      newTextBoxMap.set(textBox.id, textBox)
    })

    // If something is different, update the atom
    if (textBoxesChanged || newTextBoxMap.size !== textBoxMap.size) {
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
