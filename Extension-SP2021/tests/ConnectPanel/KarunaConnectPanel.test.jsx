/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, fireEvent, waitFor } from '../testRecoilUtils.jsx'

import '@testing-library/jest-dom/extend-expect'
import { toHaveClass } from '@testing-library/jest-dom/matchers'

import KarunaConnect from '../../src/in-content/unifiedComponents/KarunaConnect.jsx'

expect.extend({ toHaveClass })

describe('Karuna Connect Panel', () => {
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
    await waitFor(() => (
      expect(statusDrawer).toHaveClass('makeStyles-panelHidden-30') &&
        expect(mainDrawer).toHaveClass('makeStyles-panelExpanded-39')
    ))
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
    await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelHidden-57'))
    await waitFor(() => expect(mainDrawer).toHaveClass('makeStyles-panelExpanded-66'))

    // Click main drawer back arrow
    const closePanelButton = await findByRole('button', { name: 'Close Panel' })
    expect(closePanelButton).toBeInTheDocument()
    fireEvent.click(closePanelButton)

    // Check that status is visible but retracted and main panel is hidden
    await waitFor(() => (
      expect(statusDrawer).toHaveClass('makeStyles-panelRetracted-55') &&
        expect(mainDrawer).toHaveClass('makeStyles-panelHidden-67')
    ))
  })
})
