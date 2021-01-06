// React library
import React from 'react'
import ReactDOM from 'react-dom'

// Material-UI Setup
import { create as JSSCreate } from 'jss'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { StylesProvider, jssPreset } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

// pick a date util library
import MomentUtils from '@date-io/moment'

// Raw CSS strings to use in HTML construction
import EECConnectCSS from './EECConnectStyle.txt'

// Custom React Component
import ConnectComponent from './ConnectComponents/ConnectComponent.jsx'

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

  setupElement () {
    // Create custom CSS to apply only within the shadow dom
    this.customStyle = jQuery('<style>')
    this.customStyle.text(EECConnectCSS)

    // Insert icon from defined attribute or default icon
    this.imageIcon = jQuery('<img>')
    this.imageIcon.attr('id', 'EECButton')
    this.imageIcon.attr('src', EECConnect.DEFAULT_IMG)
    this.imageIcon.addClass('eec-connect-icon')

    // container for the icon
    this.sidebar = jQuery('<div>')
    this.sidebar.addClass('eec-connect')
    this.sidebar.append(this.imageIcon)

    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(this.sidebar, this.customStyle)
  }

  setupElementReact () {
    // Setup basic shadow-DOM styles
    this.customStyle = jQuery('<style>')
    this.customStyle.text(EECConnectCSS)

    // Setup root div for react to take over
    this.sidebar = jQuery('<div>')
    this.sidebar.addClass('eec-connect')

    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(this.customStyle, this.sidebar)

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

    // Give React control of the root element
    console.log('[[IN-CONTENT EECConnect]] Building react component ...')
    ReactDOM.render(
      <StylesProvider jss={jss}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ConnectComponent/>
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </StylesProvider>,
      this.sidebar[0]
    )
    console.log('[[IN-CONTENT EECConnect]] ... mounted')
  }

  setContextName (newContext) {
    this.contextName = newContext
  }
}

// A default image as a data url (same as icon-48.png)
EECConnect.DEFAULT_IMG = 'data:image/png;base64,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'

// Define the new element and export it
customElements.define('eec-connect', EECConnect)
export default EECConnect
