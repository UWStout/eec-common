// Express router and path lib
import Express from 'express'
import path from 'path'

// JWT authorization middleware
import { decodeToken } from './auth.js'

import Debug from 'debug'
const debug = Debug('server:wizard')

// Path for redirections
const REDIR_PATH = '/karuna/oz/'
if (process.argv.find((arg) => { return arg === 'DEV' })) {
  REDIR_PATH = '/oz/'
}

// Path to raw view files
const VIEW_PATH = './views/wizard'

// Create a router to attach to an express server app
const router = new Express.Router()

// List of pages that do not require authorization to access
const unAuthPages = [
  '/login.html', '/logout.html', '/register.html',
  '/login.js', '/logout.js', '/register.js',
  '/authHelper.js'
]

// Account login or registration (no auth required)
router.get('/*', decodeToken, (req, res, next) => {
  // Rewrite default path
  if (req.path === '/') { return res.redirect(REDIR_PATH + 'emeraldCity.html') }

  // Non-authorized paths
  if (unAuthPages.indexOf(req.url) >= 0) {
    // Attempt to send file in response
    debug(`serving insecure ${req.path}`)
    return res.sendFile(req.path, { root: path.resolve(VIEW_PATH) })
  } else {
    // All remaining paths require authorization or redirect to logout
    if (!req.user || req.user.error) {
      // Send to logout
      return res.redirect(REDIR_PATH + 'logout.html')
    }

    // Attempt to send file in response
    debug(`serving secure ${req.path}`)
    return res.sendFile(req.path, { root: path.resolve(VIEW_PATH) })
  }
})

export default router
