/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen, presentVisibleAndContained } from '../testRecoilUtils.jsx'
import { fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'
import { toBeVisible, toHaveClass } from '@testing-library/jest-dom/matchers'

import AffectSurveyList from '../../src/in-content/unifiedComponents/AffectSurvey/AffectSurveyList.jsx'

// Testing accordians
function retrieveAndCheckHeader (headerName) {
  return () => {
    // Render with recoil state
    const { getByRole } = render(
      <AffectSurveyList />
    )

    // Access the document and find the affect survey and the heading button of interest
    const affectSurvey = getByRole('region', { name: 'Affect Survey' })
    const headingButton = getByRole('button', { name: headerName })

    // Ensure they are in the document, visible, and heading is contained by affect survey
    presentVisibleAndContained(expect, affectSurvey, headingButton)
  }
}

function checkExpandHeader (headerName) {
  jest.setTimeout(30000)
  return async () => {
    // Render with recoil state
    const { getByRole, findByRole } = render(
      <AffectSurveyList />
    )

    // Access the document and find the heading button of interest
    const headingButton = getByRole('button', { name: 'Expand ' + headerName })
    const favoriteButton = getByRole('button', { name: 'Expand Favorite Emojis' })
    const recentButton = getByRole('button', { name: 'Expand Recent Emojis' })

    if (headerName === 'All Emojis') {
      const otherButtons = [favoriteButton, recentButton]
      expect(headingButton).toHaveAttribute('aria-expanded', 'true')
      otherButtons.forEach((otherButton) => {
        expect(otherButton).toHaveAttribute('aria-expanded', 'false')
      })

      // Click the All emoji button to retract the list
      fireEvent.click(headingButton)

      // Ensure all the lists are retracted now
      expect(headingButton).toHaveAttribute('aria-expanded', 'false')
      otherButtons.forEach((otherButton) => {
        expect(otherButton).toHaveAttribute('aria-expanded', 'false')
      })
    } else {
      // Get other regions for headings
      const otherButton = (headerName === 'Recent Emojis') ? favoriteButton : recentButton

      // Ensure they are all initially collapsed
      expect(headingButton).toHaveAttribute('aria-expanded', 'false')
      expect(otherButton).toHaveAttribute('aria-expanded', 'false')

      // Click the proper heading
      fireEvent.click(headingButton)

      // Wait for region to become visible
      const region = await findByRole('list', { name: headerName })
      await waitFor(() => (expect(region).toBeVisible()))

      // Ensure their collapsed attributes now match
      expect(headingButton).toHaveAttribute('aria-expanded', 'true')
      expect(otherButton).toHaveAttribute('aria-expanded', 'false') // stays unexpanded
    }
  }
}

async function getPrivacyDialog () {
  const { getByText, findByRole } = render(
    <AffectSurveyList />
  )

  // clicking one of the affects makes the privacy dialog show up
  const affect = getByText('Joy')

  // Click the proper heading
  fireEvent.click(affect)

  // Wait for region to become visible
  const privacyDialog = await findByRole('form', { name: 'Privacy Dialog' })
  expect(privacyDialog).toBeInTheDocument()
  expect(privacyDialog).toBeVisible()

  return privacyDialog
}

expect.extend({ toBeVisible, toHaveClass })

// List of heading names
const HEADINGS = {
  recent: 'Recent Emojis',
  favorites: 'Favorite Emojis',
  all: 'All Emojis'
}

describe('Affect Survey', () => {
  it('shows up', () => {
    // Render with recoil state
    const { getByRole } = render(
      <AffectSurveyList />
    )

    // Access the document and find the drawer
    const affectSurvey = getByRole('region', { name: 'Affect Survey' })
    expect(affectSurvey).toBeInTheDocument()
    expect(affectSurvey).toBeVisible()
  })
  it('does not show affects disapproved by the team', () => {
    render(
      <AffectSurveyList />
    )
    // expect affects not related to happiness to not come up
    const affect = screen.queryByText('Sexual Desire')
    expect(affect).toBeNull()
  })

  it('has a search bar at the top', () => {
    // Render with recoil state
    const { getByRole } = render(
      <AffectSurveyList />
    )

    // Access the document and find the drawer
    const searchBar = getByRole('search', { name: 'Affect Search Box' })
    expect(searchBar).toBeInTheDocument()
    expect(searchBar).toBeVisible()
  })
  it('Search bar is functional', () => {
    // Render with recoil state
    const { getByText } = render(
      <AffectSurveyList />
    )

    // Access the document and find the search bar in the affect survey
    const searchBar = screen.queryByPlaceholderText(/search emojis/i)
    fireEvent.change(searchBar, { target: { value: 'happiness' } })
    expect(searchBar.value).toBe('happiness')

    // expect the joy emoji to come up
    const joyEmoji = getByText('Joy')
    expect(joyEmoji).toBeInTheDocument()
    expect(joyEmoji).toBeVisible()

    // expect affects not related to happiness to not come up
    const angryEmoji = screen.queryByText('Anger')
    expect(angryEmoji).toBeNull()
  })

  // Tests for all the list section headings
  it('shows recent emojis section heading', retrieveAndCheckHeader('Expand ' + HEADINGS.recent))
  it('shows favorite emojis section heading', retrieveAndCheckHeader('Expand ' + HEADINGS.favorites))
  it('shows all emojis section heading', retrieveAndCheckHeader('Expand ' + HEADINGS.all))

  // Tests for all the list section's visibility
  it('expands recent emojis section only when clicked', checkExpandHeader(HEADINGS.recent))
  it('expands favorite emojis section only when clicked', checkExpandHeader(HEADINGS.favorites))
  it('retracts all emojis section only when clicked', checkExpandHeader(HEADINGS.all))
})

describe('Privacy Dialog', () => {
  // Check that privacy questionnaire comes up
  it('shows up', async () => {
    await getPrivacyDialog()
  })

  it.todo('Keeping the affect private does not change your team status affect icon but does change your current mood icon')
  it.todo('Sharing your affect changes your team status icon and your mood icon')
  it.todo('Canceling your affect update means none of your status\' or icons update')
  it.todo('Clicking the "Why Share?" button leads you to another page')
  it.todo('Clicking the "Is This Secure?" button leads you to another page')
  it.todo('Checking the "Save my response" will affect if the privacy dialog comes up again')
})
