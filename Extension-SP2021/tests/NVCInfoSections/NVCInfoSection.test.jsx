/**
 * @jest-environment jsdom
 */

import React from 'react'

import { render, screen, presentVisibleAndContained } from '../testRecoilUtils.jsx'
import { fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom/extend-expect'
import { toBeVisible, toHaveClass } from '@testing-library/jest-dom/matchers'

describe('NVC Element Descriptions', () => {
  // test that the description page for each of the 4 NVC elements come up
  it.todo('Observation definition shows up')
  it.todo('Need definition shows up')
  it.todo('Request definition shows up')
  it.todo('Feeling definition shows up')
  it.todo('NVC definition shows up')
})
