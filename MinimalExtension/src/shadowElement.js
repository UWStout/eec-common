import { getLastAction} from './in-content.js'

// Colorful logger
import { makeLogger } from './Logger.js'
const LOG = makeLogger('SHADOW Element', 'blue', 'white')

class MinTestShadow extends HTMLElement {
  constructor () {
    super()

    // create a shadow root
    this.attachShadow({ 
      mode: 'open',
      delegatesFocus: true
    })

    // Initialize the focus manager
    this.lastAction = ''
    this.setupFocusManager()

    // Record when we lose focus
    this.addEventListener('blur', (e) => {
      LOG('blur event')
      if (this.lastAction === 'type') {
        LOG('PRE-FOCUSING')
        this.focus()
      }
    })
  }

  setupFocusManager () {
    // if not in input box, prevent typing?
    jQuery(document).on("keydown mousedown", (e) => {  
      if (e.type === 'mousedown'){
        this.lastAction = 'click'
      } else if (e.keyCode === 9) {
        this.lastAction = 'tab'
      } else if (e.type === 'keydown') {
        this.lastAction = 'type'
      }
      LOG('Last Action:', this.lastAction)
    })
  }

  appendToShadow(childElement) {
    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(childElement)
  }
}

// Export custom element (NOTE: Don't forget to register it before use)
export default MinTestShadow
