import path from 'path'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// Import the base http library
import http from 'http'

// Using express for basic HTTP
import Express from 'express'

// Middleware for parsing cookie headers
import CookieParser from 'cookie-parser'

// enabling cross-origin requests
import Cors from 'cors'

// Our websockets events and management
import { makeSocket } from './sockets.js'

// Custom data router for our RESTFull data API
import dataRouter from './routes/data.js'

// Custom router for user authentication API
import authRouter from './routes/auth.js'

// Custom router for the back-end wizard
import wizardRouter from './routes/wizard.js'

// print messages only during debug
import Debug from 'debug'

// prints messages having to do with webtraffic
import morgan from 'morgan'

// Update environment variables
dotenv.config()
const SERVER_ROOT = process.env.SERVER_ROOT || '/'
console.log(`Server root: ${SERVER_ROOT}`)

// Make a standard express app server
const app = new Express()
const server = http.createServer(app)

// prints messages for debugging purposes
const debug = Debug('server')

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

// All authentication routes are under '/auth/'
app.use(`${SERVER_ROOT}auth`, authRouter)

// All data routes are under '/data/'
app.use(`${SERVER_ROOT}data`, dataRouter)

// All wizard routes are under '/oz/'
app.use(`${SERVER_ROOT}oz`, wizardRouter)

// Everything else is a static file
app.use(`${SERVER_ROOT}`, Express.static(path.resolve('./public')))

// Setup web-sockets
makeSocket(server)

// If this is a dev run, use 'reload' else just bind to port 8000
if (process.argv.find((arg) => { return arg === 'dev' })) {
  // Start server listening on debug/dev port
  server.listen(process.env.DEV_PORT, 'localhost', () => {
    debug(`Karuna DEV server listening on port ${process.env.DEV_PORT}`)
  })
} else {
  // Start server listening on main/production port
  app.set('trust proxy', ['loopback'])
  server.listen(process.env.PROD_PORT, 'localhost', () => {
    console.log(`Karuna server listening on port ${process.env.PROD_PORT}`)
  })
}

// Log on SIGINT and SIGTERM before exiting
function handleSignal (signal) {
  debug(`Received ${signal}, exiting.`)
  process.exit(0)
}
process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
