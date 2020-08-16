const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
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
      }]
    },

    // Enable the copy plugin
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js' },
          { from: './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js' },
          { from: './node_modules/jquery/dist/jquery.slim.min.js' },
          { from: './manifest.json' },
          { from: './src/images' },
          { from: './src/views' }
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
