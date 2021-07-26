/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, presentVisibleAndContained } from '../testRecoilUtils.jsx'

import '@testing-library/jest-dom/extend-expect'
import { toBeVisible, toContainElement, toHaveClass, toHaveAttribute } from '@testing-library/jest-dom/matchers'

import ConnectMainDrawer from '../../src/in-content/unifiedComponents/KarunaConnect/ConnectMainDrawer.jsx'
import { fireEvent, waitFor } from '@testing-library/react'

expect.extend({ toBeVisible, toContainElement, toHaveAttribute, toHaveClass })

// List of heading names
const HEADINGS = {
  userStatus: 'Current User Status',
  teamStatus: 'Team Status',
  teamCulture: 'Team Culture',
  nvcInfo: 'NVC Information'
}

function retrieveAndCheckHeader (headerName) {
  return () => {
    // Render with recoil state
    const { getByRole } = render(
      <ConnectMainDrawer />
    )

    // Access the document and find the main drawer and the heading button of interest
    const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
    const headingButton = getByRole('button', { name: headerName })

    // Ensure they are in the document, visible, and heading is contained by main drawer
    presentVisibleAndContained(expect, mainDrawer, headingButton)
  }
}

function checkClickingHeader (headerName) {
  return async () => {
    // Render with recoil state
    const { getByRole, findByRole } = render(
      <ConnectMainDrawer />
    )

    // Access the document and find the heading button of interest
    const headingButton = getByRole('button', { name: headerName })

    // Get other regions for headings
    const otherButtons = []
    Object.values(HEADINGS).forEach((name) => {
      if (name !== headerName) {
        otherButtons.push(getByRole('button', { name }))
      }
    })

    // Ensure they are all initially collapsed
    expect(headingButton).toHaveAttribute('aria-expanded', 'false')
    otherButtons.forEach((otherButton) => {
      expect(otherButton).toHaveAttribute('aria-expanded', 'false')
    })

    // Click the proper heading
    fireEvent.click(headingButton)

    // Wait for region to become visible
    const region = await findByRole('region', { name: headerName })
    await waitFor(() => (expect(region).toBeVisible()))

    // Ensure their collapsed attributes now match
    expect(headingButton).toHaveAttribute('aria-expanded', 'true')
    otherButtons.forEach((otherButton) => {
      expect(otherButton).toHaveAttribute('aria-expanded', 'false')
    })
  }
}

describe('Karuna Connect Panel', () => {
  describe('Connect Main Drawer', () => {
    it('shows up', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the drawer
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      expect(mainDrawer).toBeInTheDocument()
      expect(mainDrawer).toBeVisible()
    })

    it('contains title', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the panel title
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const panelTitle = getByRole('heading', { name: 'Panel Title' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, panelTitle)
    })

    it('contains main content', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the main content
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const mainContent = getByRole('region', { name: 'Main Content' })

      // Ensure they are in the document, visible, and content is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, mainContent)
    })

    it('contains current status', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the panel title
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const currentStatus = getByRole('region', { name: 'Current Status of User' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, currentStatus)
    })

    it('contains team status', async () => {
      // Render with recoil state
      const { getByRole, findByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the panel title
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const teamStatusButton = getByRole('button', { name: 'Team Status' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, teamStatusButton)

      fireEvent.click(teamStatusButton)
      const teamStatus = await findByRole('region', { name: 'Current Status of Team' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, teamStatus)
    })

    it('contains team culture', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the panel title
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const teamCultureButton = getByRole('button', { name: 'Team Culture' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, teamCultureButton)
    })

    it('contains NVC information', async () => {
      // Render with recoil state
      const { getByRole, findByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the panel title
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const nvcInfoButton = getByRole('button', { name: 'NVC Information' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, nvcInfoButton)

      fireEvent.click(nvcInfoButton)
      const nvcInfo = await findByRole('region', { name: 'List of NVC Elements' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, nvcInfo)
    })

    it('contains affect survey', async () => {
      // Render with recoil state
      const { getByRole, findByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the panel title
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const currentStatusButton = getByRole('button', { name: 'Current User Status' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, currentStatusButton)

      fireEvent.click(currentStatusButton)
      const affectSurveyLink = await findByRole('link', { name: 'Open Affect Survey' })

      fireEvent.click(affectSurveyLink)
      const affectSurvey = await findByRole('region', { name: 'Affect Survey' })

      // Ensure they are in the document, visible, and title is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, affectSurvey)
    })

    it('contains back arrow', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectMainDrawer />
      )

      // Access the document and find the main drawer and the back arrow
      const mainDrawer = getByRole('complementary', { name: 'Main Drawer' })
      const closePanelButton = getByRole('button', { name: 'Close Panel' })

      // Ensure they are in the document, visible, and button is contained by main drawer
      presentVisibleAndContained(expect, mainDrawer, closePanelButton)
    })

    // Tests for all the accordion section headings
    it('shows user status section heading', retrieveAndCheckHeader(HEADINGS.userStatus))
    it('shows team status section heading', retrieveAndCheckHeader(HEADINGS.teamStatus))
    it('shows team culture section heading', retrieveAndCheckHeader(HEADINGS.teamCulture))
    it('shows NVC section heading', retrieveAndCheckHeader(HEADINGS.nvcInfo))

    // Tests for all the accordion section's visibility
    it('expands user status section only when clicked', checkClickingHeader(HEADINGS.userStatus))
    it('expands team status section only when clicked', checkClickingHeader(HEADINGS.teamStatus))
    it('expands team culture section only when clicked', checkClickingHeader(HEADINGS.teamCulture))
    it('expands NVC section only when clicked', checkClickingHeader(HEADINGS.nvcInfo))
  })
})
