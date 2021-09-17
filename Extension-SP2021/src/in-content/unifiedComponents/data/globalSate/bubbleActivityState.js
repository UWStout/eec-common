import { atom, selector } from 'recoil'

// Bring in bubble panel specific activities
import { ACTIVITIES } from '../../KarunaBubble/Activities/Activities.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL Bubble Activity State', '#27213C', '#EEF4ED')

/** The trail of activities clicked through in the bubble panel */
export const BubbleActivityStackState = atom({
  key: 'BubbleActivityStackState',
  default: [ACTIVITIES.LOGIN.key],
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
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.includes(newActivity)) {
      LOG.error(`Activity "${newActivity}" already in bubble stack`)
    } else {
      set(BubbleActivityStackState, [...activityStack, newActivity])
    }
  }
})

/** Remove activity from top of stack */
export const PopBubbleActivityState = selector({
  key: 'PopBubbleActivityState',
  get: ({ get }) => {
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty bubble activity stack')
      return ''
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, activityToPop) => {
    const activityStack = get(BubbleActivityStackState)
    if (activityStack.length > 1) {
      const currentActivity = activityStack[activityStack.length - 1]
      if (currentActivity !== activityToPop) {
        LOG.error(`Current bubble activity (${currentActivity}) does not match pop request (${activityToPop})`)
      } else {
        set(BubbleActivityStackState, activityStack.slice(0, -1))
      }
    } else {
      LOG.error('Refusing to remove the last bubble activity (prevented stack underflow)')
    }
  }
})
