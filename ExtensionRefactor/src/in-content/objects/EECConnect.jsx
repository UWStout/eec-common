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
import StatusManager from './ThreeIconStatusComponents/StatusManager.jsx'

// Utility enums and functions for app context management
import * as CONTEXT_UTIL from '../../util/contexts.js'

class EECConnect extends HTMLElement {
  constructor () {
    super()

    // Initialize internal data
    this.otherStatuses = {}

    // create a shadow root
    this.attachShadow({ mode: 'open' })

    // Read the JWT for later
    chrome.runtime.sendMessage({ type: 'read', key: 'JWT' }, (response) => {
      console.log('[[IN-CONTENT]] EECConnect Received token')
      console.log(response)
      this.JWT = response.value
    })

    // We are interested in window resizing
    window.addEventListener('resize', this.onWindowResized.bind(this))
  }

  // MUST be called manually now (with an event emitter)
  setupElementReact (contextName, emitter) {
    // Set the context name
    this.contextName = contextName

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

    // Setup event emitter
    this.statusEmitter = emitter

    // Give React control of the root element for the connect panel
    console.log('[[IN-CONTENT EECConnect]] Building react component ...')
    ReactDOM.render(
      <StylesProvider jss={jss}>
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ConnectComponent context={this.contextName} emitter={this.statusEmitter} />
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
            <StatusManager context={this.contextName} emitter={this.statusEmitter} />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </StylesProvider>,
      this.statusPanel[0]
    )
    console.log('[[IN-CONTENT EECConnect]] ... mounted')

    // Start out hidden
    this.updateVisibility(false)

    // Setup status icons for other users
    this.updateOtherStatusList()

    // Setup to update the styling after deferring some time
    setTimeout(() => { this.setContextName.bind(this)(contextName) }, 200)
  }

  onMutation () {
    this.updateOtherStatusList(false)

    // Re-apply our scroll listener, just in case
    const memberDiv = jQuery('div[class^=members-]')
    if (memberDiv !== this.memberDiv) {
      memberDiv.on('scroll', this.onMemberScroll.bind(this))
      this.memberDiv = memberDiv
    }
  }

  onWindowResized () {
    this.updateOtherStatusList(true)
  }

  onMemberScroll () {
    this.updateOtherStatusList(true)
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

      case 'login':
        this.JWT = message.token
        if (this.statusEmitter) {
          this.statusEmitter.emit('login')
        }
        this.updateVisibility(true)
        break

      case 'logout':
        this.JWT = null
        this.updateVisibility(false)
        break
    }
  }

  updateVisibility (show) {
    if (!show) {
      this.statusPanel.hide()
      this.connectPanel.hide()
    } else if (this.JWT) {
      this.statusPanel.show()
      this.connectPanel.show()
    }
  }

  updateOtherStatusList (resizeOnly) {
    console.log('%c[[REACT]]', 'background: #222; color: #bada55', 'Checking User List')
    const otherAvatars = jQuery('div[class^=avatar-] div[class^=wrapper-]')
    const oldStatuses = { ...this.otherStatuses }
    const newStatuses = []

    let somethingChanged = false
    otherAvatars.each((index, curElem) => {
      const jqElem = jQuery(curElem)
      const discordName = jqElem.attr('aria-label').split(',')[0]
      const anchor = jqElem.offset()
      const dims = { width: jqElem.width(), height: jqElem.height() }

      const newStatus = { discordName, anchor, dims, status: null }
      if (resizeOnly) {
        this.otherStatuses[discordName] = newStatus
        delete oldStatuses[discordName]
        somethingChanged = true
      } else {
        if (this.otherStatuses[discordName] === undefined) {
          newStatuses[discordName] = newStatus
          console.log('%c[[REACT]]', 'background: #222; color: #bada55', `-- NEW user "${discordName}" (${JSON.stringify(anchor)})`)
          somethingChanged = true
        } else {
          delete oldStatuses[discordName]
        }
      }
    })

    if (resizeOnly || Object.keys(newStatuses).length > 0 || Object.keys(oldStatuses).length > 0) {
      // Delete old statuses that are no longer needed
      Object.keys(oldStatuses).forEach((oldStatusKey) => {
        delete this.otherStatuses[oldStatusKey]
        console.log('%c[[REACT]]', 'background: #222; color: #bada55', `-- User GONE "${oldStatusKey}"`)
        somethingChanged = true
      })

      // Merge remaining statuses with new ones
      if (Object.keys(newStatuses).length > 0) {
        this.otherStatuses = { ...this.otherStatuses, ...newStatuses }
      }

      // Signal updated statuses if something changed
      if (somethingChanged) {
        console.log('%c[[REACT]]', 'background: #222; color: #bada55', '-- EMITTING CHANGE')
        this.statusEmitter.emit('statusListChanged', { ...this.otherStatuses })
      }
    }
  }

  statusHasChanged (oldStatus, newStatus) {
    if (oldStatus === undefined || oldStatus.anchor === undefined || oldStatus.dims === undefined) {
      return true
    }

    if (Math.abs(oldStatus.anchor.top - newStatus.anchor.top) > 1e-4 ||
        Math.abs(oldStatus.anchor.left - newStatus.anchor.left) > 1e-4) {
      return true
    }

    if (Math.abs(oldStatus.dims.width - newStatus.dims.width) > 1e-4 ||
        Math.abs(oldStatus.dims.height - newStatus.dims.height) > 1e-4) {
      return true
    }

    return false
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

// Export custom element (NOTE: Don't forget to register it before use)
export default EECConnect
