// Load all the CSS as raw strings
// NOTE: eslint does not like using in-line loaders like this so we disable it
/* eslint-disable */
import AnimateCSS from 'raw-loader!animate.css/animate.min.css'
/* eslint-enable */

// Return all the CSS for this library as a string
export function getCSSString () {
  // Return CSS as one long string
  return `${AnimateCSS}`
}
