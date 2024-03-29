// React library
import React from 'react'
import ReactDOM from 'react-dom'

// Font-awesome library (for bundling)
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Recoil state management
import { RecoilRoot } from 'recoil'

// Material-UI Setup
import { create as JSSCreate } from 'jss'
import { MuiThemeProvider, createTheme, StylesProvider, jssPreset } from '@material-ui/core/styles'

// Custom React Component
import UnifiedApp from './unifiedComponents/UnifiedApp.jsx'

// For global state initialization
import { setMessagingContext } from './unifiedComponents/data/globalSate/appState.js'

// Manual import of CSS to make animate.css work
import * as AnimateCSS from './CSSHelpers/animateCSS.js'

// Colorful logger
import { makeLogger } from '../util/Logger.js'
const LOG = makeLogger('EEC Unified', '#222', '#bada55')

// Has font awesome been initialized
let FA_INITIALIZED = false

class EECUnified extends HTMLElement {
  constructor () {
    super()

    // Internal tracking of the messaging context
    this.fullContext = {}

    // Initialize font-awesome once
    if (!FA_INITIALIZED) {
      library.add(fas)
      FA_INITIALIZED = true
    }

    // Initialize internal data
    this.otherStatuses = {}

    // create a shadow root
    this.attachShadow({ mode: 'open' })

    // Read the JWT for later
    chrome.runtime.sendMessage({ type: 'read', key: 'JWT' }, (response) => {
      this.JWT = response.value
    })
  }

  // MUST be called manually now (with an event emitter)
  setupElementReact (contextName, emitter) {
    // Set the context name
    this.fullContext.context = contextName

    // Create 3rd party library CSS for the shadow dom
    this.vendorStyle = jQuery('<style>')
    this.vendorStyle.text(AnimateCSS.getCSSString())

    // Setup root div for react unified app
    this.unifiedPanel = jQuery('<div>')
    this.unifiedPanel.addClass('eec-unified-root')

    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(this.vendorStyle, this.unifiedPanel)

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
    const theme = createTheme({
      typography: {
        fontFamily: [
          '"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'
        ].join(','),
        htmlFontSize: (contextName === 'msTeams' ? 10 : 16),
        h1: {
          // AIW This is 24px
          fontSize: (contextName === 'msTeams' ? '2.4rem' : '1.5rem')
        },
        h2: {
          // AIW This is 20px
          fontSize: (contextName === 'msTeams' ? '2rem' : '1.25rem')
        },
        h3: {
          // AIW This is 16px bold
          fontWeight: 'bold'
        }
      },
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
    this.registerListeners()

    // Announce when app is fully ready
    const self = this
    this.statusEmitter.on('unifiedAppReady', () => {
      if (!self.alreadyAnnounced) {
        LOG('Announcing context is ready')
        self.backgroundPort.postMessage({
          type: 'contextReady',
          context: self.fullContext.context
        })
        self.alreadyAnnounced = true
      }
    })

    // Give React control of the root element for the unified panel
    ReactDOM.render(
      // Allows isolation of MUI styles to the shadow DOM
      <StylesProvider jss={jss}>
        {/* Provides custom portals to popovers and modals */}
        <MuiThemeProvider theme={theme}>
          {/* Provides access to global state throughout App */}
          <RecoilRoot>
            <React.Suspense fallback={<div />}>
              <UnifiedApp context={this.fullContext.context} emitter={this.statusEmitter} />
            </React.Suspense>
          </RecoilRoot>
        </MuiThemeProvider>
      </StylesProvider>,
      this.unifiedPanel[0]
    )

    // Start out hidden
    // this.updateVisibility(false)

    // Setup to update the styling after deferring some time
    setTimeout(() => { this.setContextName.bind(this)(contextName) }, 200)
  }

  registerListeners () {
    // Register to send text update messages back to the background context
    this.statusEmitter.on('textUpdate', (messageObj) => {
      LOG('Responding to text update event:', messageObj.content)
      if (this.backgroundPort) {
        LOG('Sending context details:', this.fullContext)
        this.backgroundPort.postMessage({
          type: 'textUpdate',
          ...messageObj
        })
      }
    })
  }

  // Update background communication port
  setBackgroundPort (extensionPort) {
    this.backgroundPort = extensionPort
    if (this.backgroundPort) {
      LOG('Binding background message listener')
      this.backgroundPort.onMessage.addListener(
        this.backgroundMessage.bind(this)
      )
    }
  }

  // Respond to a message from the background script
  backgroundMessage (message) {
    switch (message.type) {
      case 'context':
        this.fullContext = { ...message }
        delete this.fullContext.type
        // if (!CONTEXT_UTIL.isValidChannel(this.fullContext.teamName, this.fullContext.channelName, this.fullContext.context)) {
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

        if (this.backgroundPort) {
          this.backgroundPort.postMessage({
            type: 'contextReady',
            context: this.fullContext.context
          })
        }
        break

      case 'logout':
        this.JWT = null
        if (this.statusEmitter) {
          this.statusEmitter.emit('logout')
        }
        // this.updateVisibility(false)
        break

      // All these messages just get duplicated/bounced in the status emitter
      case 'karunaMessage':
      case 'statusMessage':
      case 'teammateStatusUpdate':
      case 'teammateInfoUpdate':
        if (this.statusEmitter) {
          LOG(`${message.type} bouncing`, message)
          this.statusEmitter.emit(message.type, message)
        } else {
          LOG(`Background ${message.type} received but emitter is undefined`, message)
        }
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
    this.fullContext.context = newContext
    setMessagingContext(newContext)
  }
}

// Export custom element (NOTE: Don't forget to register it before use)
export default EECUnified
