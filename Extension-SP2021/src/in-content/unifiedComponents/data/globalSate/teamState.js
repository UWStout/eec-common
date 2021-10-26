import { atom, selector } from 'recoil'

import * as HELPER from '../backgroundHelper.js'
import { getMessagingContext } from './appState.js'
import { UserTeamsState } from './userState.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL Team State', '#27213C', '#EEF4ED')

/** List of available affects/emojis */
export const AffectListState = atom({
  key: 'AffectListState',
  default: { },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveAffectList(getMessagingContext()))

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Affect list updated', newVal)
      })
    }
  ]
})

const ToggleDisabledDeleteState = atom({
  key: 'ToggleDisabledDeleteState',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('toggle disabled delete state updated', newVal)
      })
    }
  ]
})

/** List of  user's Disabled emojis */
export const DisabledAffectsListState = selector({
  key: 'DisabledAffectsListState',
  get: async ({ get }) => {
    const activeTeamID = get(ActiveTeamIDState)
    try {
      const disabledAffects = await HELPER.retrieveTeamDisabledAffectsList(activeTeamID, getMessagingContext())
      return disabledAffects
    } catch (err) {
      LOG.error(`Failed to retrieve disabled affects for team "${activeTeamID}"`)
      LOG.error(err)
      return []
    }
  },

  set: ({ set, get }, disabled) => {
    // Update local cached state
    const isDelete = get(ToggleDisabledDeleteState)
    let disabledList = get(DisabledAffectsListState)
    if (isDelete) {
      disabledList = disabledList.filter((emoji) => (
        emoji !== disabled
      ))
      set(DisabledAffectsListState, disabledList)
      // Send to the database
      HELPER.removeTeamDisabledAffect(disabled, getMessagingContext())
    } else {
      set(DisabledAffectsListState, [disabled, ...disabledList])

      // Send to the database
      HELPER.setTeamDisabledAffect(disabled, getMessagingContext())
    }
  }
})

/** Index of the active team in the 'UserTeamsState' array */
export const ActiveTeamIndexState = atom({
  key: 'ActiveTeamIndexState',
  default: 0
})

/** Currently Active Team (TODO: Make this an array of ALL active teams) */
export const ActiveTeamIDState = selector({
  key: 'ActiveTeamIDState',
  get: ({ get }) => {
    // Get list of user's teams and the active team index
    const teams = get(UserTeamsState)
    const activeTeamIndex = get(ActiveTeamIndexState)

    // Confirm that both the array and team index are valid
    if (Array.isArray(teams) && teams.length > activeTeamIndex) {
      return teams[activeTeamIndex]._id
    } else {
      return ''
    }
  }
})

/** Count of active team updates as state */
export const ActiveTeamInfoUpdatedState = atom({
  key: 'ActiveTeamInfoUpdatedState',
  default: 0,
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Active Team Info/Status count updated:', newVal)
      })
    }
  ]
})

/** Most recent teammates basic user info */
export const TeammatesUserInfoState = selector({
  key: 'TeammatesUserInfoState',
  get: async ({ get }) => {
    get(ActiveTeamInfoUpdatedState) // <-- import to ensure we update whenever this one does

    const activeTeamID = get(ActiveTeamIDState)
    if (activeTeamID === '') {
      LOG('No active team, skipping teammate info retrieval')
      return []
    }

    try {
      const teammatesInfo = await HELPER.retrieveTeamUserInfoAndStatus(activeTeamID, getMessagingContext())
      return teammatesInfo
    } catch (err) {
      LOG.error(`Failed to retrieve teammates info with status for team "${activeTeamID}"`)
      LOG.error(err)
      return []
    }
  }
})

/** Status updated for one teammate, trigger state lookup */
export const TeammateStatusUpdateState = selector({
  key: 'TeammateStatusUpdateState',
  get: ({ get }) => {
    const activeTeamStateUpdateCount = get(ActiveTeamInfoUpdatedState)
    return activeTeamStateUpdateCount
  },
  set: ({ get, set }) => {
    const activeTeamStateUpdateCount = get(ActiveTeamInfoUpdatedState)
    set(ActiveTeamInfoUpdatedState, activeTeamStateUpdateCount + 1)
  }
})

/** Active team's temperature */
export const TeamAffectTemperature = selector({
  key: 'TeamAffectTemperature',
  get: async ({ get }) => {
    const activeTeamID = get(ActiveTeamIDState)
    if (!activeTeamID) { return 'N/A' }
    try {
      const teamTemperature = await HELPER.retrieveTeamAffectTemperature(activeTeamID, getMessagingContext())
      return teamTemperature
    } catch (err) {
      LOG(`Failed to retrieve temperature for team "${activeTeamID}"`)
      return 'N/A'
    }
  }
})
