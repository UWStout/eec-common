// Using express for basic HTTP
import Express from 'express'

// Custom data router for our RESTfull data API
import dataRouter from './data.js'

// Custom router for user authentication API
import authRouter from './auth.js'

// Make a standard express app server
const app = new Express()

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
  app.listen(3000, 'localhost', () => {
    console.log('Dev server listening on port 3000')
  })
} else {
  // Start server listening on main/production port
  app.listen(8000, 'localhost', () => {
    console.log('Production server listening on port 8000')
  })
}

// Log on SIGINT and SIGTERM before exiting
function handleSignal (signal) {
  console.log(`Received ${signal}, exiting.`)
  process.exit(0)
}
process.on('SIGINT', handleSignal)
process.on('SIGTERM', handleSignal)
