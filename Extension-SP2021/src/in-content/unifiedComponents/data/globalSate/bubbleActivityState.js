import { atom, selector } from 'recoil'

// Bring in bubble panel specific activities
import { ACTIVITIES } from '../../KarunaBubble/Activities/Activities.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL Bubble Activity State', '#27213C', '#EEF4ED')

// Which activities require a message to be valid
const requireMessage = [
  ACTIVITIES.AFFECT_SURVEY.key,
  ACTIVITIES.KARUNA_MESSAGE.key,
  ACTIVITIES.WATSON_MESSAGE.key,
  ACTIVITIES.STATUS_MESSAGE.key
]

// Which activities can have duplicates in the stack
const allowedDuplicates = [
  ACTIVITIES.KARUNA_MESSAGE.key,
  ACTIVITIES.WATSON_MESSAGE.key
]

/** The trail of activities clicked through in the bubble panel */
export const BubbleActivityStackState = atom({
  key: 'BubbleActivityStackState',
  default: [ACTIVITIES.BLANK_MESSAGE],
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Bubble activity stack updated', newVal)
      })
    }
  ]
})

/** The active message for display in the dialog */
export const BubbleActiveStatusMessageState = atom({
  key: 'BubbleActiveStatusMessageState',
  default: {},
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Bubble active status message updated', newVal)
      })
    }
  ]
})

/** Add an activity to the stack */
export const PushBubbleActivityState = selector({
  key: 'PushBubbleActivityState',
  get: ({ get }) => {
    // If stack is not empty, return top of stack
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty bubble activity stack')
      return { key: '' }
    }
    return activityStack[activityStack.length - 1]
  },

  set: ({ get, set }, newActivity) => {
    // Validate the enw activity
    if (!newActivity?.key) {
      LOG.error('Invalid bubble activity:', newActivity)
      return
    } else if (requireMessage.includes(newActivity.key) && !newActivity.message) {
      LOG.error('Bubble activity message missing:', newActivity)
      return
    }

    const activityStack = get(BubbleActivityStackState)

    // Avoid duplicates of some activities
    if (!allowedDuplicates.includes(newActivity.key)) {
      LOG('Checking for duplicates of', newActivity.key)
      // Look for duplicate
      const index = activityStack.findIndex((current) => (current.key === newActivity.key))
      if (index >= 0) { return }
    }

    // Add to top of stack
    set(BubbleActivityStackState, [...activityStack, newActivity])
  }
})

/** Remove activity from top of stack */
export const PopBubbleActivityState = selector({
  key: 'PopBubbleActivityState',
  get: ({ get }) => {
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty bubble activity stack')
      return { key: '' }
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, activityToPop) => {
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.length > 1) {
      const currentActivity = activityStack[activityStack.length - 1]
      if (currentActivity?.key !== activityToPop?.key) {
        LOG.error(`Current bubble activity (${currentActivity?.key}) does not match pop request (${activityToPop?.key})`)
      } else {
        const newStack = activityStack.slice(0, -1)
        set(BubbleActivityStackState, newStack)
      }
    } else {
      LOG.error('Refusing to remove the last bubble activity (prevented stack underflow)')
    }
  }
})
