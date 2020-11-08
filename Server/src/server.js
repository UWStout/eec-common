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

// Update environment variables
dotenv.config()

// Make a standard express app server
const app = new Express()
const server = http.createServer(app)

// Cors configuration to allow any origin and echo it back
app.use(Cors({ origin: true }))

// Install the cookie parser
app.use(CookieParser())

// Log all server requests to the console
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`)
  next()
})

// Enable parsing of JSON-Encoded bodies
app.use(Express.json())

// All authentication routes are under '/auth/'
app.use('/auth', authRouter)

// All data routes are under '/data/'
app.use('/data', dataRouter)

// All wizard routes are under '/oz/'
app.use('/oz', wizardRouter)

// Everything else is a static file
app.use('/', Express.static(path.resolve('./public')))

// Setup web-sockets
makeSocket(server)

// If this is a dev run, use 'reload' else just bind to port 8000
if (process.argv.find((arg) => { return arg === 'dev' })) {
  // Start server listening on debug/dev port
  app.listen(process.env.DEV_PORT, 'localhost', () => {
    console.log(`Dev server listening on port ${process.env.DEV_PORT}`)
  })
} else {
  // Start server listening on main/production port
  app.listen(process.env.PROD_PORT, 'localhost', () => {
    console.log(`Production server listening on port ${process.env.PROD_PORT}`)
  })
}

// Log on SIGINT and SIGTERM before exiting
function handleSignal (signal) {
  console.log(`Received ${signal}, exiting.`)
  process.exit(0)
}
process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
