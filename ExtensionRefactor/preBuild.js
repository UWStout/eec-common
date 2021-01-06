// Import base node libraries
const fs = require('fs')

// Read in all the CSS from Tippy.js
const baseCSS = fs.readFileSync('./node_modules/tippy.js/dist/tippy.css', { encoding: 'utf-8' })
const lightCSS = fs.readFileSync('./node_modules/tippy.js/themes/light.css', { encoding: 'utf-8' })
const materialCSS = fs.readFileSync('./node_modules/tippy.js/themes/material.css', { encoding: 'utf-8' })
const perspectiveCSS = fs.readFileSync('./node_modules/tippy.js/animations/perspective.css', { encoding: 'utf-8' })

// Output it as a text file
fs.writeFileSync(
  './src/in-content/objects/cssHelpers/TippyJS.css.txt',
  `${baseCSS}\n${lightCSS}\n${materialCSS}\n${perspectiveCSS}`,
  { encoding: 'utf-8' }
)

// Read in all the FontAwesome CSS
const FontAwesomeCSS = fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css', { encoding: 'utf-8' })
const FontAwesomeCSSBrands= fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/css/brands.min.css', { encoding: 'utf-8' })
const FontAwesomeCSSSolid = fs.readFileSync('./node_modules/@fortawesome/fontawesome-free/css/solid.min.css', { encoding: 'utf-8' })

// Output it as a text file
fs.writeFileSync(
  './src/in-content/objects/cssHelpers/FontAwesome.css.txt',
  `${FontAwesomeCSS}\n${FontAwesomeCSSBrands}\n${FontAwesomeCSSSolid}`,
  { encoding: 'utf-8' }
)

// Read in the Animate.css CSS
const AnimateCSS = fs.readFileSync('node_modules/animate.css/animate.min.css', { encoding: 'utf-8' })

// Output it as a text file
fs.writeFileSync('./src/in-content/objects/cssHelpers/Animate.css.txt', AnimateCSS, { encoding: 'utf-8' })
