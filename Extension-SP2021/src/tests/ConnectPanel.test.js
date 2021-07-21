/**
 * @jest-environment jsdom
 */

import React from 'react'

import {
  render,
  fireEvent,
  screen,
  cleanup
} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { toBeVisible } from '@testing-library/jest-dom/matchers'

import ConnectStatusDrawer from '../in-content/unifiedComponents/KarunaConnect/ConnectStatusDrawer.jsx'
import ConnectMainDrawer from '../in-content/unifiedComponents/KarunaConnect/ConnectMainDrawer.jsx'
import KarunaConnect from '../in-content/unifiedComponents/KarunaConnect.jsx'

expect.extend({ toBeVisible })

describe('ConnectPanel', () => {
  afterEach(cleanup) // avoid memory leaks

  describe('ConnectStatusDrawer', () => {
    it('shows up correctly', () => {
      const { getByTestId, asFragment } = render(<ConnectStatusDrawer />)
      const ConnectStatusDrawer = getByTestId('connectStatusDrawer')
      expect(ConnectStatusDrawer).toBeInTheDocument()
      expect(asFragment(<ConnectStatusDrawer />)).toMatchSnapshot()
    })

    it('shows a single arrow on load', () => {
      const { getByTestId } = render(<ConnectStatusDrawer />)
      // the panel has a single arrow
      const singleArrow = getByTestId('keyboardArrowRight')
      expect(singleArrow).toBeInTheDocument()
    })

    it('shows double arrow on hover of single arrow', () => {
      const { getByTestId } = render(<ConnectStatusDrawer />)

      // the panel has a single arrow
      const singleArrow = getByTestId('keyboardArrowRight')
      expect(singleArrow).toBeInTheDocument()

      // on mouseOver, a double arrow is shown
      fireEvent.mouseOver(singleArrow)
      const doubleArrow = getByTestId('doubleArrow')
      expect(doubleArrow).toBeInTheDocument()
    })

    it('shows double arrow on hover of status panel', () => {
      const { getByTestId } = render(<ConnectStatusDrawer />)
      const ConnectStatusDrawer = getByTestId('connectStatusDrawer')
      // on mouseOver, a double arrow is shown
      fireEvent.mouseOver(ConnectStatusDrawer)
      const doubleArrow = getByTestId('doubleArrow')
      expect(doubleArrow).toBeInTheDocument()
    })

    it('expands on hover', () => {
      const { asFragment, getByTestId } = render(<ConnectStatusDrawer />)
      const ConnectStatusDrawer = getByTestId('connectStatusDrawer')
      // on mouseOver, panel expands
      fireEvent.mouseOver(ConnectStatusDrawer)

      // compare with snapshot
      expect(asFragment()).toMatchSnapshot()
    })

    it('hides when mouse moves away', () => {
      const { asFragment, getByTestId } = render(<ConnectStatusDrawer />)
      const ConnectStatusDrawer = getByTestId('connectStatusDrawer')

      // on mouseOver, panel expands
      fireEvent.mouseOver(ConnectStatusDrawer)
      // on mouseLeave, panel retracts
      fireEvent.mouseLeave(ConnectStatusDrawer)

      // compare with snapshot
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('ConnectMainDrawer', () => {
    it('shows up', () => {
      const { getByTestId } = render(<ConnectMainDrawer hidden={false} />)
      const mainPanel = getByTestId('ConnectMainDrawer')
      expect(mainPanel).toBeInTheDocument()
    })
    it('shows title', () => {
      render(<ConnectMainDrawer hidden={false} />)
      const title = screen.getByRole('heading', { name: 'title' })
      expect(title).toBeInTheDocument()
    })

    it('shows main content', () => {
      render(<ConnectMainDrawer hidden={false} />)
      const paragraph = screen.getByRole('main')
      expect(paragraph).toBeInTheDocument()
    })

    it('shows back arrow', () => {
      render(<ConnectMainDrawer hidden={false} />)
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

  it('shows ConnectStatusDrawer on load', () => {
    const { getByTestId } = render(<KarunaConnect />)

    // the panel with the single arrow on middle right of the screen shows up
    const ConnectStatusDrawer = getByTestId('connectStatusDrawer')
    expect(ConnectStatusDrawer).toBeInTheDocument()
  })

  it('shows ConnectMainDrawer on click', () => {
    const { getByTestId } = render(<KarunaConnect />)

    // Connect status panel shows up
    const ConnectStatusDrawer = getByTestId('connectStatusDrawer')

    // clicking the status panel brings up the main panel
    fireEvent.click(ConnectStatusDrawer)
    const mainPanel = getByTestId('ConnectMainDrawer')
    expect(mainPanel).toBeInTheDocument()
  })

  it('goes back to ConnectStatusDrawer when ConnectMainDrawer\'s back arrow is clicked', () => {
    const { getByTestId } = render(<KarunaConnect />)

    // Connect status panel shows up
    const statusPanel = getByTestId('connectStatusDrawer')

    // clicking the status panel brings up the main panel
    fireEvent.click(statusPanel)
    const mainPanel = getByTestId('ConnectMainDrawer')

    // clicking back arrow on the main panel leads back to status panel
    const closeMainPanel = screen.getByRole('button', { name: 'close panel' })
    fireEvent.click(closeMainPanel)
    expect(statusPanel).toBeInTheDocument()
  })
})
