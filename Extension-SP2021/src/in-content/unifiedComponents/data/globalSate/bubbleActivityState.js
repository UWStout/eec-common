import { atom, selector } from 'recoil'

// Bring in bubble panel specific activities
import { ACTIVITIES } from '../../KarunaBubble/Activities/Activities.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL Bubble Activity State', '#27213C', '#EEF4ED')

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

/** Add an activity to the stack */
export const PushBubbleActivityState = selector({
  key: 'PushBubbleActivityState',
  get: ({ get }) => {
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty bubble activity stack')
      return ''
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, newActivity) => {
    // Validate the enw activity
    if (!newActivity?.key) {
      LOG.error('Invalid bubble activity:', newActivity)
    } else if (newActivity.key !== ACTIVITIES.BLANK_MESSAGE.key && newActivity.key !== ACTIVITIES.PRIVACY_PROMPT.key && !newActivity.message) {
      LOG.error('Bubble activity message missing:', newActivity)
    }

    // Add to top of stack
    const activityStack = get(BubbleActivityStackState)
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
        set(BubbleActivityStackState, activityStack.slice(0, -1))
      }
    } else {
      LOG.error('Refusing to remove the last bubble activity (prevented stack underflow)')
    }
  }
})
