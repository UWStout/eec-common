/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, fireEvent, waitFor } from '../testRecoilUtils.jsx'

import '@testing-library/jest-dom/extend-expect'
import { toHaveClass } from '@testing-library/jest-dom/matchers'

import ConnectStatusDrawer from '../../src/in-content/unifiedComponents/KarunaConnect/ConnectStatusDrawer.jsx'

expect.extend({ toHaveClass })

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
      const singleArrow = getByRole('button', { name: 'Left Arrow' })
      fireEvent.mouseOver(singleArrow)

      const doubleArrow = await findByRole('button', { name: 'Left Double Arrow' })
      expect(doubleArrow).toBeInTheDocument()
    })

    it('shows double arrow on hover of status panel', async () => {
      const { getByRole, findByRole } = render(
        <ConnectStatusDrawer />
      )

      // on mouseOver of the status drawer, a double arrow is shown
      const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
      fireEvent.mouseOver(statusDrawer)

      const doubleArrow = await findByRole('button', { name: 'Left Double Arrow' })
      expect(doubleArrow).toBeInTheDocument()
    })

    it('expands on hover', async () => {
      const { getByRole } = render(
        <ConnectStatusDrawer />
      )

      // On mouseOver, panel expands
      const statusDrawer = getByRole('complementary', { name: 'Status Drawer' })
      fireEvent.mouseOver(statusDrawer)

      // Look for expanded class
      await waitFor(() => expect(statusDrawer).toHaveClass('makeStyles-panelExpanded-42'))
    })

    it('hides when mouse moves away', async () => {
      const { getByRole } = render(
        <ConnectStatusDrawer />
      )
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
