// Express router and path lib
import Express from 'express'
import path from 'path'

// JWT authorization middleware
import { decodeToken } from './auth.js'

import Debug from 'debug'

// Load variables into process.env and read extra environment variables from the .env file
import dotenv from 'dotenv'
dotenv.config()

const debug = Debug('server:wizard')

// Path for redirection
const REDIRECT_PATH = `${process.argv.SERVER_ROOT ? process.argv.SERVER_ROOT : ''}/oz/`

// Path to raw view files
const WIZARD_VIEW_PATH = './views/wizard'

// Create a router to attach to an express server app
const router = new Express.Router()

// Examine requests and ensure authorization before responding
router.get('/*', decodeToken, (req, res) => {
  // Rewrite default path
  if (req.path === '/') { return res.redirect(REDIRECT_PATH + 'emeraldCity.html') }

  // All remaining paths require authorization so redirect if not logged in
  if (!req.user || req.user.error) {
    // Send to login
    debug(`Redirecting ${req.path} to login.html`)
    const dest = encodeURIComponent(REDIRECT_PATH + 'emeraldCity.html')
    return res.redirect(`../login.html?dest=${dest}`)
  }

  // Check for admin status
  if (req.user.userType !== 'admin') {
    debug(`User not authorized to use wizard "${req.user.email}" (${req.user.userType})`)
    return res.status(401).send('Not authorized (admins only)')
  }

  // Attempt to send file in response
  return res.sendFile(req.path, { root: path.resolve(WIZARD_VIEW_PATH) })
})

export default router
