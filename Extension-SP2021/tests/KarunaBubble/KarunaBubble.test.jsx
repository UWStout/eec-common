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
  it.todo('displays the affect survey')
  it.todo('displays the list of observations')
  it.todo('observations are in response to typing in the messaging apps textbox')
  it.todo('affect survey shows up after a certain time passes for the user')
  it.todo('clicking on the NVC observation leads to the NVC description of the specific NVC element')
  it.todo('displays the Watson message')
})
