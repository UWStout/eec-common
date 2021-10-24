import { atom, selector } from 'recoil'

import * as HELPER from '../backgroundHelper.js'
import { ValidUserState } from './userState.js'

// Colorful logger
import { makeLogger } from '../../../../util/Logger.js'
const LOG = makeLogger('RECOIL Settings State', '#27213C', '#EEF4ED')

/** Customizable karuna settings for the current user */
export const KarunaSettingsState = atom({
  key: 'KarunaSettingsState',
  default: {

  },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize
      setSelf(HELPER.retrieveKarunaSettings())

      // Log any value changes for debugging
      onSet((newVal) => {
        LOG('Karuna Settings updated', newVal)
      })
    }
  ]
})

export const KarunaSettingsSyncState = selector({
  key: 'KarunaSettingsSyncState',
  get: async ({ get }) => {
    const validUser = get(ValidUserState)
    if (validUser) {
      try {
        const karunaSettings = await HELPER.retrieveKarunaSettings()
        return karunaSettings
      } catch (err) {
        LOG.error('Failed to retrieve user\'s karuna settings')
        LOG.error(err)
        return null
      }
    } else {
      return null
    }
  },

  set: ({ get, set }, newSettings) => {
    const validUser = get(ValidUserState)
    if (validUser) {
      try {
        HELPER.updateKarunaSettings(newSettings)
        set(KarunaSettingsState, newSettings)
      } catch (err) {
        LOG.error('Failed to update user\'s karuna settings')
        LOG.error(err)
      }
    } else {
      LOG.error('Can\'t update karuna settings when not logged in')
    }
  }
})
