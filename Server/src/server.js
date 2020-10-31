// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// Using express for basic HTTP
import Express from 'express'

// enabling cross-origin requests
import Cors from 'cors'

// Custom data router for our RESTFull data API
import dataRouter from './routes/data.js'

// Custom router for user authentication API
import authRouter from './routes/auth.js'

// Update environment variables
dotenv.config()

// Make a standard express app server
const app = new Express()

// Cors configuration to allow any origin and echo it back
app.use(Cors({ origin: true }))

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
