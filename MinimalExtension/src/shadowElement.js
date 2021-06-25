class MinTestShadow extends HTMLElement {
  constructor () {
    super()

    // create a shadow root
    this.attachShadow({ mode: 'open' })
  }

  appendToShadow(childElement) {
    // Attach the elements to the shadow DOM
    jQuery(this.shadowRoot).append(childElement)
  }
}

// Export custom element (NOTE: Don't forget to register it before use)
export default MinTestShadow
