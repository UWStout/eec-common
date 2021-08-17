// Import base node libraries
const fs = require('fs')

// Read in the Animate.css CSS
const AnimateCSS = fs.readFileSync('node_modules/animate.css/animate.min.css', { encoding: 'utf-8' })

// Output it as a text file
fs.writeFileSync('./src/in-content/CSSHelpers/Animate.css.txt', AnimateCSS, { encoding: 'utf-8' })
