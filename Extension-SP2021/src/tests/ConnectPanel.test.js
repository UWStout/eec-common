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

import OpenArrow from '../in-content/unifiedComponents/OpenArrow.jsx'
import ConnectStatusPanel from '../in-content/unifiedComponents/ConnectStatusPanel.jsx'
import ConnectMainPanel from '../in-content/unifiedComponents/ConnectMainPanel.jsx'
import ConnectComponent from '../in-content/unifiedComponents/ConnectComponent.jsx'

expect.extend({ toBeVisible })

describe('ConnectPanel', () => {
  afterEach(cleanup)

  describe('ConnectStatusPanel', () => {
    afterEach(cleanup)

    it('shows up', () => {
      const { getByTestId } = render(<ConnectStatusPanel hidden={true} />)
      const connectStatusPanel = getByTestId("connectStatusPanel")
      expect(connectStatusPanel).toBeInTheDocument()
    })
  
    it('shows a single arrow on load', () => {
      const { getByTestId } = render(<ConnectStatusPanel hidden={true} />)
      // the panel has a single arrow
      const singleArrow = getByTestId('keyboardArrowRight')
      expect(singleArrow).toBeInTheDocument()
    })
  
    it('shows double arrow on hover of single arrow', () => {
      const { getByTestId } = render(<ConnectStatusPanel hidden={true} />)
      
      // the panel has a single arrow
      const singleArrow = getByTestId('keyboardArrowRight')
      expect(singleArrow).toBeInTheDocument()
  
      // on mouseOver, a double arrow is shown
      fireEvent.mouseOver(singleArrow);
      const doubleArrow = getByTestId('doubleArrow')
      expect(doubleArrow).toBeInTheDocument()
    })

    it('shows double arrow on hover of status panel', () => {
      const { getByTestId } = render(<ConnectStatusPanel hidden={true} />)
      const connectStatusPanel = getByTestId("connectStatusPanel")
      // on mouseOver, a double arrow is shown
      fireEvent.mouseOver(connectStatusPanel);
      const doubleArrow = getByTestId('doubleArrow')
      expect(doubleArrow).toBeInTheDocument()
    })

    it('expands on hover', () => {
      const { getByTestId } = render(<ConnectStatusPanel hidden={true} />)
      const connectStatusPanel = getByTestId("connectStatusPanel")
      // on mouseOver, panel expands
      fireEvent.mouseOver(connectStatusPanel)
      expect(connectStatusPanel).toHaveStyle('right: -theme.spacing(8)')
    })

    it.todo('hides when mouse moves away')
  })

  describe('ConnectMainPanel', () => {
    it('shows up', () => {
      const { getByTestId } = render(<ConnectMainPanel hidden={false} />)
      const mainPanel = getByTestId("connectMainPanel")
      expect(mainPanel).toBeInTheDocument()
  
    })
    it('shows title', () => {
      render(<ConnectMainPanel hidden={false} />)
      const title = screen.getByRole('heading', { name: 'title' })
      expect(title).toBeInTheDocument()
    })

    it('shows main content', () => {
      render(<ConnectMainPanel hidden={false} />)
      const paragraph = screen.getByRole('main')
      expect(paragraph).toBeInTheDocument()
    })

    it('shows back arrow', () => {
      render(<ConnectMainPanel hidden={false} />)
      const closeButton = screen.getByRole("button", { name: 'close panel' })
      expect(closeButton).toBeInTheDocument()
    })
  })

  it('shows ConnectStatusPanel on load', () => {
    const { getByTestId } = render(<ConnectComponent />)
    
    // the panel with the single arrow on middle right of the screen shows up
    const connectStatusPanel = getByTestId("connectStatusPanel")
    expect(connectStatusPanel).toBeInTheDocument()
  })

  it('shows ConnectMainPanel on click', () => {
    const { getByTestId } = render(<ConnectComponent />)
  
    // Connect status panel shows up
    const connectStatusPanel = getByTestId("connectStatusPanel")
    
    // clicking the status panel brings up the main panel
    fireEvent.click(connectStatusPanel)
    const mainPanel = getByTestId("connectMainPanel")
    expect(mainPanel).toBeInTheDocument()

  })

  it('goes back to ConnectStatusPanel when ConnectMainPanel\'s back arrow is clicked', () => {
    const { getByTestId } = render(<ConnectComponent />)
  
    // Connect status panel shows up
    const statusPanel = getByTestId("connectStatusPanel")
    
    // clicking the status panel brings up the main panel
    fireEvent.click(statusPanel)
    const mainPanel = getByTestId("connectMainPanel")
    
    // clicking back arrow on the main panel leads back to status panel
    const closeMainPanel = screen.getByRole("button", { name: 'close panel' })
    fireEvent.click(closeMainPanel)
    expect(statusPanel).toBeInTheDocument()
  })
})
