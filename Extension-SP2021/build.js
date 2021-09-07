const ESBuild = require('esbuild')

// Is this a dev build?
let _DEV_ = false
if (process.argv.find((arg) => { return arg === 'dev' })) {
  _DEV_ = true
}

const options = {
  entryPoints: [
    './src/background/background.js',
    './src/in-content/in-content.js',
    './src/popup/popup.jsx'
  ],
  outdir: './dist/js',
  entryNames: '/[name]',
  bundle: true,
  sourcemap: _DEV_,
  minify: (!_DEV_),
  define: {
    _VER_: `"${process.env.npm_package_version}"`,
    _DEV_,
    'process.env.NODE_ENV': (_DEV_ ? '"development"' : '"production"')
  }
}

ESBuild.build(options).catch(
  () => {
    process.exit(1)
  }
)
