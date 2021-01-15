// Essential file libraries
import fs from 'fs'
import path from 'path'
// import  { dirname } from 'path'
// import { fileURLToPath } from 'url'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// Import the base http libraries
import http from 'http'
import https from 'https'

// Using express for basic HTTP
import Express from 'express'

// Middleware for parsing cookie headers
import CookieParser from 'cookie-parser'

// enabling cross-origin requests
import Cors from 'cors'

// Our websockets events and management
import { makeSocket } from './sockets.js'

// Custom router for authentication API
import authRouter from './routes/auth.js'

// Custom router for user data API
import userRouter from './routes/user.js'

// Custom router for user team API
import teamRouter from './routes/team.js'

// Custom router for team org-unit API
import orgUnitRouter from './routes/orgUnit.js'

// custom router for testing purposes
import testRouter from './routes/test.js'

import adminRouter from './routes/adminRoutes.js'

// Custom router for admin-only backend routes
import wizardRouter from './routes/wizard.js'
import dbAdminRouter from './routes/dbAdmin.js'

// print messages only during debug
import Debug from 'debug'

// prints messages having to do with web traffic
import morgan from 'morgan'

// Update environment variables
dotenv.config()
const SERVER_ROOT = process.env.SERVER_ROOT || '/'
console.log(`Server root: ${SERVER_ROOT}`)

// prints messages for debugging purposes
const debug = Debug('server')

// Initialize express app
const app = new Express()

// Build HTTP/HTTPS server
let server
if (process.env.HEROKU) {
  // Create normal HTTP server (heroku handles SSL)
  console.log('Production HTTP server for HEROKU dyno')
  server = http.createServer(app)
} else {
  // Not HEROKU so make an HTTPS server
  debug('Creating local HTTPS server for dev')
  const SSL_KEY_FILE = process.env.SERVER_KEY || './certs/server.key'
  const SSL_CERT_FILE = process.env.SERVER_CERT || './certs/server.crt'
  const SSLOptions = {
    key: fs.readFileSync(SSL_KEY_FILE),
    cert: fs.readFileSync(SSL_CERT_FILE)
  }

  // Make an HTTPS express server app
  server = https.createServer(SSLOptions, app)
}

// middleware

// prints messages related to web traffic
// app.use(morgan('combined')) //gives all the information
app.use(morgan('tiny'))

// Cors configuration to allow any origin and echo it back
app.use(Cors({ origin: true }))

// Install the cookie parser
app.use(CookieParser())

// Enable parsing of JSON-Encoded bodies
app.use(Express.json())

// used for MongoDB set up
app.use('/admin', adminRouter)

// All authentication routes are under '/auth/'
app.use(`${SERVER_ROOT}auth`, authRouter)

// All user data routes are under '/data/user'
app.use(`${SERVER_ROOT}data/user`, userRouter)

// All team data routes are under '/data/team'
app.use(`${SERVER_ROOT}data/team`, teamRouter)

// All org-unit data routes are under '/data/unit'
app.use(`${SERVER_ROOT}data/unit`, orgUnitRouter)

// All testing routes are under '/test/'
app.use(`${SERVER_ROOT}test`, testRouter)

// All wizard routes are under '/oz/'
app.use(`${SERVER_ROOT}oz`, wizardRouter)

// All database administration routes are under '/dbAdmin/'
app.use(`${SERVER_ROOT}dbAdmin`, dbAdminRouter)

// Login/out authorization routes from root
app.use('/', Express.static(path.resolve('./views/auth')))

// Everything else is a static file
app.use(`${SERVER_ROOT}`, Express.static(path.resolve('./public'), { index: 'instructions.html' }))

// Setup web-sockets
makeSocket(server)

// Start listening on ports listed in .env
const DEV_PORT = process.env.DEV_PORT || 3000
const PROD_PORT = process.env.PORT || process.env.PROD_PORT || 42424
if (process.argv.find((arg) => { return arg === 'dev' })) {
  // Start server listening on debug/dev port
  server.listen(DEV_PORT, 'localhost', () => {
    debug(`Karuna DEV server listening on port ${DEV_PORT}`)
  })
} else {
  // Start server listening on main/production port
  server.listen(PROD_PORT, 'localhost', () => {
    console.log(`Karuna server listening on port ${PROD_PORT}`)
  })
}

// Log on SIGINT and SIGTERM before exiting
function handleSignal (signal) {
  debug(`Received ${signal}, exiting.`)
  process.exit(0)
}
process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
