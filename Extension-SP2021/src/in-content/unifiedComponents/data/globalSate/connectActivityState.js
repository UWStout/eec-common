import { atom, selector } from 'recoil'

// Bring in connect panel specific activities
import { ACTIVITIES } from '../../KarunaConnect/Activities/Activities.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL Connect Activity State', '#27213C', '#EEF4ED')

/** The trail of activities clicked through in the connect panel */
export const ConnectActivityStackState = atom({
  key: 'ConnectActivityStackState',
  default: [ACTIVITIES.LOGIN.key],
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Connect activity stack updated', newVal)
      })
    }
  ]
})

/** Add an activity to the stack */
export const PushConnectActivityState = selector({
  key: 'PushConnectActivityState',
  get: ({ get }) => {
    const activityStack = get(ConnectActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty connect activity stack')
      return ''
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, newActivity) => {
    const activityStack = get(ConnectActivityStackState)
    if (activityStack.includes(newActivity)) {
      LOG.error(`Activity "${newActivity}" already in connect stack`)
    } else {
      set(ConnectActivityStackState, [...activityStack, newActivity])
    }
  }
})

/** Remove activity from top of stack */
export const PopConnectActivityState = selector({
  key: 'PopConnectActivityState',
  get: ({ get }) => {
    const activityStack = get(ConnectActivityStackState)
    if (activityStack.length < 1) {
      LOG.error('Empty connect activity stack')
      return ''
    }
    return activityStack[activityStack.length - 1]
  },
  set: ({ get, set }, activityToPop) => {
    const activityStack = get(ConnectActivityStackState)
    if (activityStack.length > 1) {
      const currentActivity = activityStack[activityStack.length - 1]
      if (currentActivity !== activityToPop) {
        LOG.error(`Current connect activity (${currentActivity}) does not match pop request (${activityToPop})`)
      } else {
        set(ConnectActivityStackState, activityStack.slice(0, -1))
      }
    } else {
      LOG.error('Refusing to remove the last connect activity (prevented stack underflow)')
    }
  }
})
