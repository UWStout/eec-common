const fs = require('fs')

let _DEV_ = false
if (process.argv.find((arg) => { return arg === 'dev' })) {
  _DEV_ = true
}

const manifest = {
  manifest_version: 2,
  name: (_DEV_ ? 'Karuna EEC DEV Extension' : 'Karuna EEC Extension'),
  version: '0.1.0',
  description: 'Chrome extension for the Karuna EEC system to help with empathetic communication over electronic tools.',
  icons: {
    16: `images/icon-${_DEV_ ? 'dev-' : ''}16.png`,
    48: `images/icon-${_DEV_ ? 'dev-' : ''}48.png`,
    128: `images/icon-${_DEV_ ? 'dev-' : ''}128.png`,
    256: `images/icon-${_DEV_ ? 'dev-' : ''}256.png`,
    512: `images/icon-${_DEV_ ? 'dev-' : ''}512.png`
  },
  browser_action: {
    default_title: 'Karuna Settings',
    default_popup: 'html/popup.html'
  },
  content_scripts: [{
    matches: [
      '*://teams.microsoft.com/*',
      '*://*.discord.com/*',
      '*://*.discord.gg/*',
      '*://*.slack.com/*'
    ],
    css: [
      'css/animate.min.css'
    ],
    js: [
      'lib/webcomponents-bundle.js',
      'lib/browser-polyfill.min.js',
      'lib/jquery.slim.min.js',
      'lib/commonmark.min.js',
      'lib/eventemitter3.min.js',
      'js/in-content.js'
    ]
  }],
  web_accessible_resources: [
    'css/animate.min.css',
    'js/popup.js'
  ],
  background: {
    scripts: [
      'lib/browser-polyfill.min.js',
      'js/background.js'
    ],
    persistent: true
  },
  content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'; img-src * data: \'self\'',
  permissions: [
    'storage',
    '*://*.teams.microsoft.com/*',
    '*://*.discord.com/*',
    '*://*.discord.gg/*',
    '*://*.slack.com/*',
    (_DEV_ ? '*://localhost/*' : '*://karuna.run/*'),
    'webRequest',
    'webRequestBlocking'
  ]
}

fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 2), { encoding: 'utf8' })
