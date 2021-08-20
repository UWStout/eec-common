// Express router and path lib
import Express from 'express'
import path from 'path'

// JWT authorization middleware
import { decodeToken } from './auth.js'

import Debug from 'debug'

// Load variables into process.env and read extra environment variables from the .env file
import dotenv from 'dotenv'
dotenv.config()

const debug = Debug('karuna:server:db_admin')

// Path for redirection
const REDIRECT_PATH = `${process.argv.SERVER_ROOT ? process.argv.SERVER_ROOT : ''}/dbAdmin`

// Path to raw view files
const DB_ADMIN_VIEW_PATH = './views/dbAdmin'

// Create a router to attach to an express server app
const router = new Express.Router()

// Examine requests and ensure authorization before responding
router.get('/*', decodeToken, (req, res) => {
  // Rewrite default path
  if (req.path === '/') { return res.redirect(REDIRECT_PATH + '/Users.html') }

  // All remaining paths require authorization so redirect if not logged in
  if (!req.user || req.user.error) {
    // Send to login
    debug(`Redirecting ${req.path} to Login.html`)
    const dest = encodeURIComponent(REDIRECT_PATH + req.path)
    return res.redirect(`../Login.html?dest=${dest}`)
  }

  // Check for admin status
  if (req.user.userType !== 'admin') {
    debug(`User not authorized to use db admin "${req.user.email}" (${req.user.userType})`)
    return res.status(400).send('Not authorized (admins only)')
  }

  // Attempt to send file in response
  debug(`Serving admin page ${req.path}`)
  return res.sendFile(req.path, { root: path.resolve(DB_ADMIN_VIEW_PATH) })
})

export default router
