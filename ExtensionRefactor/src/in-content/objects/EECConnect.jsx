// React library
import React from 'react'
import ReactDOM from 'react-dom'

// Material-UI Setup
import { create as JSSCreate } from 'jss'
import { MuiThemeProvider, createMuiTheme, StylesProvider, jssPreset } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

// pick a date util library
import MomentUtils from '@date-io/moment'

// Raw CSS strings to use in HTML construction
import EECConnectCSS from './EECConnectStyle.txt'

// Custom React Component
import ConnectComponent from './ConnectComponents/ConnectComponent.jsx'
import ThreeIconStatus from './ThreeIconStatusComponents/ThreeIconStatus.jsx'

// Utility enums and functions for app context management
import * as CONTEXT_UTIL from '../../util/contexts.js'

class EECConnect extends HTMLElement {
  constructor () {
    super()

    // create a shadow root
    this.attachShadow({ mode: 'open' })

    // Read the JWT for later
    chrome.runtime.sendMessage({ type: 'read', key: 'JWT' }, (response) => {
      console.log('[[IN-CONTENT]] EECConnect Received token')
      console.log(response)
      this.JWT = response.value
    })

    // Build the element HTML/CSS
    this.setupElementReact()
  }

  setupElementReact () {
    // Setup basic shadow-DOM styles
    this.customStyle = jQuery('<style>')
    this.customStyle.text(EECConnectCSS)

    // Setup root div for react connect panel
    this.connectPanel = jQuery('<div>')
    this.connectPanel.addClass('eec-connect')

    // Setup root div for react status icons
    this.statusPanel = jQuery('<div>')
    this.statusPanel.addClass('eec-status')

    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(this.customStyle, this.connectPanel, this.statusPanel)

    // Create a comment node for injection of Material-UI styles
    this.insertionNode = jQuery('<noscript>').attr('id', 'jss-insertion-point')
    this.shadowRoot.insertBefore(this.insertionNode[0], this.shadowRoot.firstChild)

    // Create our own instance of JSS that will use our custom insertion point
    const jss = JSSCreate({
      ...jssPreset(),
      insertionPoint: this.insertionNode[0]
    })

    // Create a custom Material-UI theme to direct portal containers to the shadow dom
    const portalParent = jQuery('<div>').attr('id', 'muiPortalParent')
    this.portalContainer = jQuery('<div>').attr('id', 'muiPortal')
    portalParent.append(this.portalContainer)
    this.shadowRoot.appendChild(portalParent[0])
    const theme = createMuiTheme({
      props: {
        MuiPopover: {
          container: () => { return this.portalContainer[0] }
        },
        MuiModal: {
          container: () => { return this.portalContainer[0] }
        }
      }
    })

    // Give React control of the root element for the connect panel
    console.log('[[IN-CONTENT EECConnect]] Building react component ...')
    ReactDOM.render(
      <StylesProvider jss={jss}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ConnectComponent />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </StylesProvider>,
      this.connectPanel[0]
    )

    // ... and the status icons
    ReactDOM.render(
      <StylesProvider jss={jss}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ThreeIconStatus />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </StylesProvider>,
      this.statusPanel[0]
    )
    console.log('[[IN-CONTENT EECConnect]] ... mounted')

    // Start out hidden
    this.updateVisibility(false)
  }

  // Update background communication port
  setBackgroundPort (extensionPort) {
    this.backgroundPort = extensionPort
    if (this.backgroundPort) {
      this.backgroundPort.onMessage.addListener(
        this.backgroundMessage.bind(this)
      )
    }
  }

  // Respond to a message from the background script
  backgroundMessage (message) {
    switch (message.type) {
      case 'context':
        if (!CONTEXT_UTIL.isValidChannel(message.teamName, message.channelName, this.contextName)) {
          this.updateVisibility(false)
        } else {
          this.updateVisibility(true)
        }
        break
    }
  }

  updateVisibility (show) {
    if (!show) {
      this.statusPanel.hide()
      this.connectPanel.hide()
    } else {
      this.statusPanel.show()
      this.connectPanel.show()
    }
  }

  setContextName (newContext) {
    this.contextName = newContext
    switch (newContext) {
      case CONTEXT_UTIL.CONTEXT.DISCORD:
        this.statusPanel.css('top', '55px')
        break

      default:
      case CONTEXT_UTIL.CONTEXT.MS_TEAMS:
        this.statusPanel.css('top', '115px')
        break
    }
  }
}

// Define the new element and export it
customElements.define('eec-connect', EECConnect)
export default EECConnect
