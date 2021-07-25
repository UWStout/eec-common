/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { toBeVisible } from '@testing-library/jest-dom/matchers'

import ConnectMainDrawer from '../../src/in-content/unifiedComponents/KarunaConnect/ConnectMainDrawer.jsx'
import { RecoilRoot } from 'recoil'

expect.extend({ toBeVisible })

describe('ConnectPanel', () => {
  describe('ConnectMainDrawer', () => {
    it('shows up', () => {
      const { getByTestId } = render(
        <RecoilRoot>
          <React.Suspense fallback={<div />}>
            <ConnectMainDrawer hidden={false} />
          </React.Suspense>
        </RecoilRoot>
      )
      const mainPanel = getByTestId('connectMainDrawer')
      expect(mainPanel).toBeInTheDocument()
    })

    it('shows title', () => {
      render(
        <RecoilRoot>
          <React.Suspense fallback={<div />}>
            <ConnectMainDrawer hidden={false} />
          </React.Suspense>
        </RecoilRoot>
      )
      const title = screen.getByRole('heading', { name: 'title' })
      expect(title).toBeInTheDocument()
    })

    it('shows main content', () => {
      render(
        <RecoilRoot>
          <React.Suspense fallback={<div />}>
            <ConnectMainDrawer hidden={false} />
          </React.Suspense>
        </RecoilRoot>
      )
      const paragraph = screen.getByRole('main')
      expect(paragraph).toBeInTheDocument()
    })

    it('shows back arrow', () => {
      render(
        <RecoilRoot>
          <React.Suspense fallback={<div />}>
            <ConnectMainDrawer hidden={false} />
          </React.Suspense>
        </RecoilRoot>
      )
      const closeButton = screen.getByRole('button', { name: 'close panel' })
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('MoodSelect', () => {
    it.todo('shows all the affects available')
    it.todo('shows affects approved of by team')
    it.todo('shows up when mood selector button is pressed')
    it.todo('has a functional search bar at the top')
    it.todo('changes position depending on where it was opened from')
    it.todo('has an accordian element for recent, favorites, (which are near the top) and all emojis available')
    it.todo('When an affect is selected, the user\'s privacy settings must be checked and a PrivacyDialog might be shown')
  })
})
