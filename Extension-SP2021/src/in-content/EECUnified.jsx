// React library
import React from 'react'
import ReactDOM from 'react-dom'

// Recoil state management
import { RecoilRoot } from 'recoil'

// Material-UI Setup
import { create as JSSCreate } from 'jss'
import { MuiThemeProvider, createMuiTheme, StylesProvider, jssPreset } from '@material-ui/core/styles'

// Custom React Component
import UnifiedApp from './unifiedComponents/UnifiedApp.jsx'

// For global state initialization
import { setMessagingContext } from './unifiedComponents/data/globalState.js'

// Utility enums and functions for app context management
import * as CONTEXT_UTIL from '../util/contexts.js'

// Colorful logger
import { makeLogger } from '../util/Logger.js'
const LOG = makeLogger('EEC Unified', '#222', '#bada55')

class EECUnified extends HTMLElement {
  constructor () {
    super()

    // Initialize internal data
    this.otherStatuses = {}

    // create a shadow root
    this.attachShadow({ mode: 'open' })

    // Read the JWT for later
    chrome.runtime.sendMessage({ type: 'read', key: 'JWT' }, (response) => {
      LOG('EECUnified Received token')
      LOG(response)
      this.JWT = response.value
    })

    // Initialize the focus manager
    this.lastAction = ''
    this.setupFocusManager()

    // Record when we lose focus
    this.addEventListener('blur', (e) => {
      LOG('blur event')
      if (this.lastAction === 'type') {
        LOG('- Type-Blur Focus')
        this.lastFocusedElement.focus()
      } else {
        this.lastFocusedElement = e.path[0]
        this.wasBlurred = true
      }
    })
  }

  setupFocusManager () {
    // if not in input box, prevent typing?
    jQuery(document).on('keydown mousedown', (e) => {
      if (e.type === 'mousedown') {
        this.lastAction = 'click'
      } else if (e.keyCode === 9) {
        this.lastAction = 'tab'
      } else if (e.type === 'keydown') {
        if (this.wasBlurred) {
          this.wasBlurred = false
          LOG('- Blur-Type Focus')
          this.lastFocusedElement.focus()
        } else {
          this.lastFocusedElement = this.shadowRoot.activeElement
          this.lastAction = 'type'
        }
      }
    })
  }

  // MUST be called manually now (with an event emitter)
  setupElementReact (contextName, emitter) {
    // Set the context name
    this.contextName = contextName

    // Setup root div for react unified app
    this.unifiedPanel = jQuery('<div>')
    this.unifiedPanel.addClass('eec-unified-root')

    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(this.unifiedPanel)

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

    // Give React control of the root element for the unified panel
    LOG('Mounting react unified component ...')
    ReactDOM.render(
      // Allows isolation of MUI styles to the shadow DOM
      <StylesProvider jss={jss}>
        {/* Provides custom portals to popovers and modals */}
        <MuiThemeProvider theme={theme}>
          {/* Provides access to global state throughout App */}
          <RecoilRoot>
            <React.Suspense fallback={<div />}>
              <UnifiedApp context={this.contextName} emitter={this.statusEmitter} />
            </React.Suspense>
          </RecoilRoot>
        </MuiThemeProvider>
      </StylesProvider>,
      this.unifiedPanel[0]
    )
    LOG('... mounted')

    // Start out hidden
    // this.updateVisibility(false)

    // Setup to update the styling after deferring some time
    setTimeout(() => { this.setContextName.bind(this)(contextName) }, 200)
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
        // if (!CONTEXT_UTIL.isValidChannel(message.teamName, message.channelName, this.contextName)) {
        //   this.updateVisibility(false)
        // } else {
        //   this.updateVisibility(true)
        // }
        break

      case 'login':
        this.JWT = message.token
        if (this.statusEmitter) {
          this.statusEmitter.emit('login')
        }
        // this.updateVisibility(true)
        break

      case 'logout':
        this.JWT = null
        if (this.statusEmitter) {
          this.statusEmitter.emit('logout')
        }
        // this.updateVisibility(false)
        break
    }
  }

  updateVisibility (show) {
    if (!show) {
      this.unifiedPanel.hide()
    } else if (this.JWT) {
      this.unifiedPanel.show()
    }
  }

  setContextName (newContext) {
    this.contextName = newContext
    setMessagingContext(newContext)
    // switch (newContext) {
    //   case CONTEXT_UTIL.CONTEXT.DISCORD:
    //     this.unifiedPanel.css('top', '55px')
    //     break

    //   case CONTEXT_UTIL.CONTEXT.MS_TEAMS:
    //   default:
    //     this.unifiedPanel.css('top', '115px')
    //     break
    // }
  }
}

// Export custom element (NOTE: Don't forget to register it before use)
export default EECUnified
