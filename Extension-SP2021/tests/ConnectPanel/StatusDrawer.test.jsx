/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, act, fireEvent, waitFor } from '../testRecoilUtils.jsx'

import '@testing-library/jest-dom/extend-expect'
import { toBeVisible, toHaveClass } from '@testing-library/jest-dom/matchers'

import ConnectStatusDrawer from '../../src/in-content/unifiedComponents/KarunaConnect/ConnectStatusDrawer.jsx'
import KarunaConnect from '../../src/in-content/unifiedComponents/KarunaConnect.jsx'

expect.extend({ toBeVisible, toHaveClass })

describe('Karuna Connect Panel', () => {
  describe('Connect Status Drawer', () => {
    it('shows up correctly', () => {
      // Render with recoil state
      const { getByRole } = render(
        <ConnectStatusDrawer hidden />
      )

      // Access the document and find the drawer
      const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
      expect(statusDrawer).toBeInTheDocument()
    })

    it('shows a single arrow on load', () => {
      const { getByRole } = render(
        <ConnectStatusDrawer />
      )

      // the panel has a single arrow
      const singleArrow = getByRole('button', { name: 'Left Arrow' })
      expect(singleArrow).toBeInTheDocument()
    })

    it('shows double arrow on hover of single arrow', async () => {
      const { getByRole, findByRole } = render(
        <ConnectStatusDrawer />
      )

      // On mouseOver, a double arrow is shown
      await act(async () => {
        const singleArrow = getByRole('button', { name: 'Left Arrow' })
        fireEvent.mouseOver(singleArrow)

        const doubleArrow = await findByRole('button', { name: 'Left Double Arrow' })
        expect(doubleArrow).toBeInTheDocument()
      })
    })

    it('shows double arrow on hover of status panel', async () => {
      const { getByRole, findByRole } = render(
        <ConnectStatusDrawer />
      )

      // on mouseOver of the status drawer, a double arrow is shown
      await act(async () => {
        const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
        fireEvent.mouseOver(statusDrawer)

        const doubleArrow = await findByRole('button', { name: 'Left Double Arrow' })
        expect(doubleArrow).toBeInTheDocument()
      })
    })

    it('expands on hover', async () => {
      const { getByRole } = render(
        <ConnectStatusDrawer />
      )

      await act(async () => {
        // On mouseOver, panel expands
        const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
        fireEvent.mouseOver(statusDrawer)

        // Look for expanded class
        await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelExpanded-42'))
      })
    })

    it('hides when mouse moves away', async () => {
      const { getByRole } = render(
        <ConnectStatusDrawer />
      )

      await act(async () => {
        const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })

        // Expand drawer first
        fireEvent.mouseOver(statusDrawer)
        await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelExpanded-52'))

        // Retract drawer
        fireEvent.mouseLeave(statusDrawer)
        await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelRetracted-51'))
      })
    })
  })

  it('shows ConnectStatusDrawer on load', () => {
    // Render the full Karuna Connect Panel
    const { getByRole } = render(
      <KarunaConnect context={'discord'} />
    )

    // the panel with the single arrow on middle right of the screen shows up
    const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
    expect(statusDrawer).toBeInTheDocument()
  })

  it('shows Main Drawer on click', async () => {
    // Render the full Karuna Connect Panel
    const { getByRole, findByRole } = render(
      <KarunaConnect context={'discord'} />
    )

    // Retrieve and click status drawer
    const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
    expect(statusDrawer).toBeInTheDocument()
    fireEvent.click(statusDrawer)

    // Retrieve main drawer
    const mainDrawer = await findByRole('complementary', { name: 'Main Drawer' })
    expect(mainDrawer).toBeInTheDocument()

    // Check that status is hidden and main panel is expanded
    await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelHidden-91'))
    await waitFor(() => expect(mainDrawer).toHaveClass('makeStyles-panelExpanded-100'))
  })

  it('goes back to Status Drawer when Main Drawer\'s back arrow is clicked', async () => {
    // Render the full Karuna Connect Panel
    const { getByRole, findByRole } = render(
      <KarunaConnect context={'discord'} />
    )

    // Retrieve and click status drawer
    const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
    expect(statusDrawer).toBeInTheDocument()
    fireEvent.click(statusDrawer)

    // Retrieve main drawer
    const mainDrawer = await findByRole('complementary', { name: 'Main Drawer' })
    expect(mainDrawer).toBeInTheDocument()

    // Check that status is hidden and main panel is expanded
    await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelHidden-119'))
    await waitFor(() => expect(mainDrawer).toHaveClass('makeStyles-panelExpanded-128'))

    // Click main drawer back arrow
    const closePanelButton = await findByRole('button', { name: 'Close Panel' })
    expect(closePanelButton).toBeInTheDocument()
    fireEvent.click(closePanelButton)

    // Check that status is expanded and main panel is hidden
    await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelExpanded-118'))
    await waitFor(() => expect(mainDrawer).toHaveClass('makeStyles-panelHidden-129'))
  })
})
