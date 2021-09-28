import ESBuild from 'esbuild'

// Is this a dev build?
let _DEV_ = false
if (process.argv.find((arg) => { return arg === 'dev' })) {
  _DEV_ = true
}

// Different sets of files for each output-dir
const publicOptions = {
  outdir: './public',
  entryPoints: [
    './client/InstructionsPage.jsx',
    './client/TeamCulturePage.jsx'
  ]
}

const clientOptions = {
  outdir: './views/auth',
  entryPoints: [
    './client/LoginPage.jsx',
    './client/LogoutPage.jsx',
    './client/RegisterPage.jsx',
    './client/RecoveryPage.jsx',
    './client/RecoveryStep2Page.jsx',
    './client/ValidatePage.jsx',
    './client/ValidateStep2Page.jsx',
    './client/PrivacyPage.jsx'
  ]
}

const adminOptions = {
  outdir: './views/dbAdmin',
  entryPoints: [
    './client/UserManagementPage.jsx',
    './client/TeamManagementPage.jsx',
    './client/OrgUnitManagementPage.jsx'
  ]
}

// Options common to all three sets of files
const sharedOptions = {
  bundle: true,
  sourcemap: _DEV_,
  minify: (!_DEV_),
  define: {
    _VER_: `"${process.env.npm_package_version}"`,
    _DEV_,
    'process.env.NODE_ENV': (_DEV_ ? '"development"' : '"production"')
  }
}

// Build each set of files
async function doBuild () {
  try {
    await ESBuild.build({ ...sharedOptions, ...publicOptions })
    await ESBuild.build({ ...sharedOptions, ...clientOptions })
    await ESBuild.build({ ...sharedOptions, ...adminOptions })
  } catch {
    process.exit(1)
  }
}
doBuild()
