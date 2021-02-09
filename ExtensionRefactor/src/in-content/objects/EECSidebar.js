/* global commonmark */

// Raw CSS strings to use in HTML construction
import EECSidebarCSS from './EECSidebarStyle.txt'

// Tooltip library for showing messages from Karuna
import tippy from 'tippy.js'

// Bring in all our CSS helpers
import * as TippyCSS from './cssHelpers/TippyCSS.js'
import * as AnimateCSS from './cssHelpers/animateCSS.js'

// Accepted context strings
import * as CONTEXT_UTIL from '../../util/contexts'

// Set some universal defaults for tippy
tippy.setDefaultProps({
  arrow: true,
  allowHTML: true,
  animation: 'perspective',
  inertia: true,
  theme: 'light'
})

class EECSidebar extends HTMLElement {
  constructor () {
    // Call parent constructor
    super()

    // Create a shadow root
    this.attachShadow({ mode: 'open' })

    // Read the JWT for later use
    chrome.runtime.sendMessage({ type: 'read', key: 'JWT' }, (response) => {
      console.log('[[IN-CONTENT]] EEC-Sidebar Received token')
      console.log(response)
      this.JWT = response.value
      this.sendGreetingMessage()
    })

    // Prepare to render markdown
    this.MDReader = new commonmark.Parser({ smart: true })
    this.MDWriter = new commonmark.HtmlRenderer()

    // Build the element HTML/CSS
    this.setupElement()
  }

  setupElement () {
    // Create 3rd party library CSS for the shadow dom
    this.vendorStyle = jQuery('<style>')
    this.vendorStyle.text(AnimateCSS.getCSSString() + '\n' + TippyCSS.getCSSString())

    // Create some custom CSS to apply only within the shadow dom
    this.customStyle = jQuery('<style>')
    this.customStyle.text(EECSidebarCSS)

    // Insert icon from defined attribute or default icon
    this.imageIcon = jQuery('<img>')
    this.imageIcon.attr('id', 'EECButton')
    this.imageIcon.attr('src', EECSidebar.DEFAULT_IMG)
    this.imageIcon.addClass('eec-sidebar-icon')

    // Alert icon for when we need the user's attention
    this.alertIcon = jQuery('<img>')
    this.alertIcon.attr('id', 'EECAlert')
    this.alertIcon.attr('src', EECSidebar.KARUNA_IMG)
    this.alertIcon.addClass('eec-sidebar-icon animate__animated animate__fadein')

    // Container for the icon and popover
    this.popover = jQuery('<div>')
    this.popover.addClass('eec-sidebar')
    this.popover.append(this.imageIcon, this.alertIcon)

    // Create the popover using tippy
    this.popoverElem = tippy(this.popover[0], {
      placement: 'top-start',
      appendTo: this.shadowRoot,
      hideOnClick: 'toggle',
      trigger: 'click'
    })
    this.popoverElem.disable() // We will enable it manually

    // Attach the created elements to the shadow DOM
    jQuery(this.shadowRoot).append(this.vendorStyle, this.customStyle, this.popover)

    // Start out hidden
    this.updateVisibility(false)
  }

  sendGreetingMessage (teamName) {
    if (typeof this.JWT === 'string') {
      if (this._welcomeShown) {
        if (teamName) {
          this.showMessage(`Karuna is active. Working in team **${teamName}**.`, false, 2000)
        } else {
          this.showMessage('Karuna is active.', false, 2000)
        }
      } else {
        const payload = this.decodeTokenPayload(this.JWT)
        setTimeout(() => {
          this.showMessage(`Karuna is active. Welcome back **${payload.firstName}**!`, false, 5000)
          this._welcomeShown = true
        }, 3000)
      }
    } else {
      setTimeout(() => {
        this.showMessage('Please **log in** to use Karuna', true, 5000)
      }, 3000)
    }
  }

  // Decode JWT payload (without verification)
  decodeTokenPayload (token) {
    // Validate that token has a payload
    if (typeof token !== 'string' || token.split('.').length < 2) {
      return {}
    }

    // Decode the JWT payload only
    return JSON.parse(atob(token.split('.')[1]))
  }

  setContextName (newContext) {
    this.contextName = newContext
    this.popoverElem.setProps({
      theme: (newContext === CONTEXT_UTIL.CONTEXT.DISCORD ? 'material' : 'light')
    })
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
          if (!this._hidden) { this.updateVisibility(false) }
        } else {
          if (this._hidden) {
            this.updateVisibility(true)
            this.sendGreetingMessage(message.teamName)
          } else {
            this.showMessage(`Working in team **${message.teamName}**`, false, 2000)
          }
        }
        break

      case 'login': {
        this.JWT = message.token
        const payload = this.decodeTokenPayload(this.JWT)
        this.showMessage(`Welcome **${payload.firstName}**!`, false, 5000)
      } break

      case 'karunaMessage':
        if (message.context === this.contextName) {
          this.showMessage(message.content)
        }
        break
    }
  }

  updateVisibility (show) {
    if (!show) {
      this._hidden = true
      this.popoverElem.hide()
      this.popoverElem.disable()
      this.imageIcon.hide()
      this.alertIcon.hide()
    } else {
      this._hidden = false
      this.popoverElem.enable()
      this.imageIcon.show()
      this.alertIcon.show()
    }
  }

  showMessage (messageText, alert = false, timeout = 0) {
    // Don't show messages when hidden (see updateVisibility)
    if (this._hidden) { return }

    if (alert) {
      this.alertIcon.attr('src', EECSidebar.ALERT_IMG)
      this.alertIcon.addClass('animate__animated animate__fadein')
      this.popover.addClass('animate__animated animate__repeat-3 animate__tada')
    }

    // Parse Markdown to HTML
    const AST = this.MDReader.parse(messageText)
    const messageHtml = this.MDWriter.render(AST)

    this.popoverElem.setContent(messageHtml)
    this.popoverElem.enable()
    this.popoverElem.show()

    if (timeout > 0) {
      setTimeout(() => {
        this.alertIcon.attr('src', EECSidebar.KARUNA_IMG)
        this.alertIcon.addClass('animate__animated animate__fadein')
        this.popover.removeClass('animate__animated animate__repeat-3 animate__tada')
        this.popoverElem.hide()
      }, timeout)
    }
  }

  // Custom Element is mounted to the DOM
  connectedCallback () {
    console.log('[[IN-CONTENT]] EEC-Sidebar element added to page.')
  }

  // Custom Element is unmounted from the DOM
  disconnectedCallback () {
    console.log('[[IN-CONTENT]] EEC-Sidebar element removed from page.')
  }

  // Custom Element is moved to a different DOM
  adoptedCallback () {
    console.log('[[IN-CONTENT]] EEC-Sidebar element moved to new page.')
  }
}

// A default image as a data url (same as icon-48.png)
EECSidebar.DEFAULT_IMG = 'data:image/png;base64,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'

// Image overlays for alerts and karuna logo
EECSidebar.KARUNA_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACVUlEQVRoge2Xz6sSURTHP5paaQoVBS7aJZQWLfoPImhTuxKKgqDEQQUJZErsvVYGpbso40mreLRo0aagoGX9B4+hltWiH/RE+yWZaZz0kQwTeXvO8Kj7gbu4517POV/nzrln0Gg0Gs1/jc8t8clkMgMsTJiulMvlC8PhEL/fL+uEw2H6/T7pdPoIYAJ+4IZlWYvTxnFTwEtgx4TpC7Azn8+/DoVCxOPxn0bTNA8B94HAeN8ny7Ki08bxzzzzX8Rs8xCweWXS6XQk+T3A4kTywjeVIG4K+G6bD2XI8QkEAlSr1e3AXWCrbV9IJYibAhyRM1+r1daP//ldDnueqvjzWsDKU7kOHHRYfwacUnHopQA5Qh8bjcY54IzD+nvgWCaTeafi1EsBUoUMoOawJuJOG4axJO+ICgGl3atDSuO8g4cBMGcYxgOfz4eMtSpg3W/sT+r1+uVgMMhgMFB26vU74MT+UqmUFvvfPAEvBXwAbjvYI8CtYrG4r9vtIkMFLwVsAC6OS6idTcCdcrm8TdoMFdzshZaBLRMmaRF2Ay+AR8ABh589Bg5blvV12jheX2ShXC7XB44Dzx3W5XK7puLQ81ZC6nw+n5fL6iiw7LDlhJK/2aX2R9++UaEZndpsNrsEnHToPnurCTJL7IlJGf0snai8qLFYTNrph0DRtm/jWhGwYJvfA15FIhGi0SiJRIJUKkWz2WwA54E3wFugrhLETQGX5KQAN8cJni0UCoN2u02r1aLXG50U+cSsVCpXgb0yTNOcczEnjUaj0Wg0Go1Go9Fo/g2AHwSljzPboCUWAAAAAElFTkSuQmCC'
EECSidebar.ALERT_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQUlEQVRoge2XTSsFYRiGr5FkZW3DVs3PsLRR/AF0VqxkQ7LhFMWOhZVfYEFZsBDlL+hNVhYWshD5KnGOpiZN07NQT+fh1H2tZu6m+52rZp55ByGE+FOyqMXzPB8GZoD+SnyTUtr19Pb6b+3XNICV2sUfgEugp/P3/cO7kb14SyMF7jpRGilgreV+ByMFHo2sqx6hByN79pZGClgTz71+pMCtMYmevKXRU6gu8OotjRSwJk5XTaE3YxJdeksjBT7LrUOVe29pmMDa5nYhMF1u6KbK4z1vb9hu9OD4jFarTZZlLC/MZc2tnXaRT4yNunrDBA5Pzlmanx0HFoEh4BRYTyldeXoj/wcmgf1afJ1SGvH0Rr7EDSMb9JZGCgwY2Ze3NFLgwsj6vKWRAhvAUeW8+LCtBq4vhBBCCCGEEEKIfwPwDbwTOzxQrJDvAAAAAElFTkSuQmCC'

// Define the new element and export it
customElements.define('eec-sidebar', EECSidebar)
export default EECSidebar
