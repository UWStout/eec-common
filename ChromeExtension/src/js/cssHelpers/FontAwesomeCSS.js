/* eslint-disable */
import FontAwesomeCSS from '!!raw-loader!@fortawesome/fontawesome-free/css/fontawesome.min.css'
import FontAwesomeCSSBrands from '!!raw-loader!@fortawesome/fontawesome-free/css/brands.min.css'
import FontAwesomeCSSSolid from '!!raw-loader!@fortawesome/fontawesome-free/css/solid.min.css'
/* eslint-enable */

// Return all the CSS for this library as a string
export function getCSSString () {
  // Rewrite the internal URLs
  const baseURL = chrome.runtime.getURL('webfonts')
  const adjFontAwesomeCSS =
    FontAwesomeCSS.replace(/url\(\.\.\/webfonts\/(.+?)\)/g, `url(${baseURL}/$1)`) + '\n' +
    FontAwesomeCSSBrands.replace(/url\(\.\.\/webfonts\/(.+?)\)/g, `url(${baseURL}/$1)`) + '\n' +
    FontAwesomeCSSSolid.replace(/url\(\.\.\/webfonts\/(.+?)\)/g, `url(${baseURL}/$1)`)

  // Return CSS as one long string
  return adjFontAwesomeCSS
}
