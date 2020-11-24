const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// All the output folders
const DEST_DIR = path.resolve(__dirname, 'dist')
const OTHER_DIRS = [
  path.join(DEST_DIR, 'images'),
  path.join(DEST_DIR, 'lib'),
  path.join(DEST_DIR, 'webfonts'),
  path.join(DEST_DIR, 'css')
]

module.exports = (env, argv) => {
  // Ensure output dirs exist
  if (!fs.existsSync(DEST_DIR)) { fs.mkdirSync(DEST_DIR) }
  OTHER_DIRS.forEach((curDir) => {
    if (!fs.existsSync(curDir)) { fs.mkdirSync(curDir) }
  })

  // Basic input and output config
  const config = {
    entry: {
      popup: './src/js/popup.js',
      background: './src/js/background.js',
      'in-content': './src/js/in-content.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },

    cache: true,

    // Rules for processing included files as they are bundled/copied
    module: {
      rules: [{
        // JS & JSX files: Transpiles with Babel to legacy JavaScript
        // NOTE: If react is not being used, remove the 'preset-react' entry
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-transform-async-to-generator',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/transform-react-jsx'
            ]
          }
        }
      }, {
        // RAW files: import any file as raw string (handy for CSS parsing)
        test: /\.raw$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'raw-loader'
      }, {
        // CSS files: imports CSS files as JS objects
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        // Processing of SASS files into JSS
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }]
    },

    // Enable the copy plugin
    plugins: [
      new CopyWebpackPlugin({
        // Copy html, images, and compiled+minified libraries into the dist folder
        patterns: [
          { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js', to: path.resolve(__dirname, 'dist/lib') },
          { from: './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js', to: path.resolve(__dirname, 'dist/lib') },
          { from: './node_modules/jquery/dist/jquery.slim.min.js', to: path.resolve(__dirname, 'dist/lib') },
          { from: './node_modules/store2/dist/store2.min.js', to: path.resolve(__dirname, 'dist/lib') },
          { from: './node_modules/@popperjs/core/dist/umd/popper.min.js', to: path.resolve(__dirname, 'dist/lib') },
          { from: './node_modules/animate.css/animate.min.css', to: path.resolve(__dirname, 'dist/css') },
          { from: './src/images', to: path.resolve(__dirname, 'dist/images') },
          { from: './src/views' },
          { from: './manifest.json' }
        ]
      })
    ]
  }

  // Special options only for development mode
  if (argv.mode === 'development') {
    config.devtool = 'eval-cheap-module-source-map'
  }

  // Add minification of files when in production mode
  if (argv.mode === 'production') {
    config.module.rules[0].use.options.presets.push('minify')
  }

  // Return the completed configuration object
  return config
}
