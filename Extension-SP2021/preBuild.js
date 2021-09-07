// Import base node libraries
const fs = require('fs')
const path = require('path')

// Path and filename info on shared components from the server
const SERVER_DIR = '../Server/client/sharedComponents/'
const LOCAL_DIR = './src/fromServer/'
const SERVER_FILES = [
  'Copyright.jsx',
  'KarunaIcon.jsx'
]

// Read in the Animate.css CSS
const AnimateCSS = fs.readFileSync('node_modules/animate.css/animate.min.css', { encoding: 'utf-8' })

// Output it as a text file
fs.writeFileSync('./src/in-content/CSSHelpers/Animate.css.txt', AnimateCSS, { encoding: 'utf-8' })

// Components from the server shared here
function errCB (err) { if (err) { console.error(err) } }
SERVER_FILES.forEach((filename) => {
  fs.copyFile(path.join(SERVER_DIR, filename), path.join(LOCAL_DIR, filename), errCB)
})
