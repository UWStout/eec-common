// Load all the CSS as raw strings
// NOTE: eslint does not like using in-line loaders like this so we disable it
/* eslint-disable */
import TippyCSS from '!!raw-loader!tippy.js/dist/tippy.css'
import TippyCSSLight from '!!raw-loader!tippy.js/themes/light.css'
import TippyCSSMaterial from '!!raw-loader!tippy.js/themes/material.css'
import TippyCSSPerspective from '!!raw-loader!tippy.js/animations/perspective.css'
/* eslint-enable */

// Return all the CSS for this library as a string
export function getCSSString () {
  // Return CSS as one long string
  return `${TippyCSS}\n${TippyCSSLight}\n${TippyCSSMaterial}\n${TippyCSSPerspective}`
}
