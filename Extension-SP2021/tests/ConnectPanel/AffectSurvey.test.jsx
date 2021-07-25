/**
 * @jest-environment jsdom
 */

// import React from 'react'

// import { render } from '../testRecoilUtils.jsx'

import '@testing-library/jest-dom/extend-expect'
import { toBeVisible, toHaveClass } from '@testing-library/jest-dom/matchers'

// import AffectSurveyList from '../../src/in-content/unifiedComponents/AffectSurvey/AffectSurveyList.jsx'

expect.extend({ toBeVisible, toHaveClass })

describe('ConnectPanel', () => {
  describe('Affect Survey', () => {
    it.todo('shows all the affects available')
    it.todo('shows affects approved of by team')
    it.todo('shows up when mood selector button is pressed')
    it.todo('has a functional search bar at the top')
    it.todo('changes position depending on where it was opened from')
    it.todo('has an accordion element for recent, favorites, (which are near the top) and all emojis available')
    it.todo('When an affect is selected, the user\'s privacy settings must be checked and a PrivacyDialog might be shown')
  })
})
