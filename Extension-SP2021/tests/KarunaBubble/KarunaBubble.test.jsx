/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen, presentVisibleAndContained } from '../testRecoilUtils.jsx'
import { fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'
import { toBeVisible, toHaveClass } from '@testing-library/jest-dom/matchers'

import KarunaBubble from '../../src/in-content/unifiedComponents/KarunaBubble.jsx'

describe('Karuna Bubble', () => {
  it('shows up', () => {
    const { getByRole } = render(
      <KarunaBubble />
    )

    // Access the document and find the affect survey and the heading button of interest
    const karunaBubble = getByRole('button', { name: 'Open Feedback Dialog' })
    expect(karunaBubble).toBeInTheDocument()
    expect(karunaBubble).toBeVisible()
  })
})
