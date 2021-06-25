import MinTestShadow from './shadowElement.js'

// Avoid jQuery conflicts
$.noConflict()

// Inject some inputs into the DOM
jQuery(document).ready(() => {
  // Append an input directly to the body (no shadow DOM)
  makeInput('karunaMinInput', 'Appended to Body', 20, 70).appendTo('body')

  // Define and create our custom element (which holds the shadow DOM)
  customElements.define('min-test-shadow', MinTestShadow)
  const shadowElement = jQuery('<min-test-shadow />')

  // Append the custom element to the Body
  shadowElement.appendTo('body')

  // Create another input but append this one to the shadow dom inside the shadow element
  const shadowInput = makeInput('karunaMinInputShadow', 'In Shadow DOM', 20, 140)
  shadowElement[0].appendToShadow(shadowInput)
})

// Quick helper function to make a text input with jQuery
function makeInput (name, placeholderText, right, top) {
  return jQuery('<input />', {
    id: name,
    name: name,
    placeholder: placeholderText,
    type: 'text',
    style: `width: 200px; right: ${right}px; top: ${top}px; z-index: 100; position: absolute;`
  })
}
