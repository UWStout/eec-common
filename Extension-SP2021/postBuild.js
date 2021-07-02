// Import base node libraries
const fs = require('fs')
const path = require('path')

// Copy-files library
const copyFiles = require('copyfiles')

// Is this a dev build?
let _DEV_ = false
if (process.argv.find((arg) => { return arg === 'dev' })) {
  _DEV_ = true
}

// Local directories used below
const distDir = path.join(path.resolve(__dirname), 'dist')
const cssDir = path.join(distDir, 'css')
const htmlDir = path.join(distDir, 'html')
const imagesDir = path.join(distDir, 'images')
const libsDir = path.join(distDir, 'lib')

// Ensure all output directories exist
function ensureExists (dirs) {
  if (!Array.isArray(dirs)) { dirs = [dirs] }
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }) }
  })
}
ensureExists([distDir, cssDir, htmlDir, imagesDir, libsDir])

/* Copy files to their respective destinations (async) */
function errCB (err) { if (err) { console.error(err) } }

// Essential Extension files
fs.copyFile('./src/popup/popup.html', path.join(htmlDir, 'popup.html'), errCB)
fs.copyFile(`./images/icon-${_DEV_ ? 'dev-' : ''}128.png`, path.join(distDir, '128.png'), errCB)
copyFiles(['./images/*.png', imagesDir], true, errCB)

// 3rd party library JS
copyFiles(['./node_modules/webextension-polyfill/dist/browser-polyfill.min.js', libsDir], true, errCB)
copyFiles(['./node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', libsDir], true, errCB)
copyFiles(['./node_modules/jquery/dist/jquery.slim.min.js', libsDir], true, errCB)
copyFiles(['./node_modules/commonmark/dist/commonmark.min.js', libsDir], true, errCB)
copyFiles(['./node_modules/eventemitter3/umd/eventemitter3.min.js', libsDir], true, errCB)

// 3rd party library CSS
copyFiles(['./node_modules/animate.css/animate.min.css', cssDir], true, errCB)
