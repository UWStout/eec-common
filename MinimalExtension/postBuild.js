// Import base node libraries
const fs = require('fs')
const path = require('path')

// Copy-files library
const copyFiles = require('copyfiles')

// Local directories used below
const distDir = path.join(path.resolve(__dirname), 'dist')
const imagesDir = path.join(distDir, 'images')
const libsDir = path.join(distDir, 'lib')

// Ensure all output directories exist
function ensureExists (dirs) {
  if (!Array.isArray(dirs)) { dirs = [dirs] }
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }) }
  })
}
ensureExists([distDir, libsDir, imagesDir])

/* Copy files to their respective destinations (async) */
function errCB (err) { if (err) { console.error(err) } }

// Essential Extension files
fs.copyFile('./manifest.json', path.join(distDir, 'manifest.json'), errCB)
fs.copyFile('./images/icon-min-128.png', path.join(distDir, '128.png'), errCB)
copyFiles(['./images/*.png', imagesDir], true, errCB)

// 3rd Party Library Files
copyFiles(['./node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', libsDir], true, errCB)
copyFiles(['./node_modules/jquery/dist/jquery.slim.min.js', libsDir], true, errCB)
