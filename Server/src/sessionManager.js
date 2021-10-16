// Middleware for managing a user session and storing it in our mongodb
import session from 'express-session'
import MongoStore from 'connect-mongo'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// Reuse our existing mongodb client connection
import { getClientPromise } from './mongo/connect.js'

// Update environment variables
dotenv.config()
const SESSION_SECRET = process.env.SESSION_SECRET || 'qwertyuiop[]'
const SESSION_COOKIE_AGE = process.env.SESSION_COOKIE_AGE || 60000

// Cached session middleware
let sessionMiddleware = null

// Function to initialize the session middleware
function makeSessionMiddleware () {
  sessionMiddleware = session({
    secret: SESSION_SECRET,
    cookie: { maxAge: SESSION_COOKIE_AGE },
    saveUninitialized: false, // Don't create session until something stored
    resave: false, // Don't save session if unmodified
    store: MongoStore.create({
      clientPromise: getClientPromise(),
      dbName: 'karunaSessions',
      touchAfter: 24 * 3600 // time period in seconds
    })
  })
}

// Retrieve the internally cached session middleware
export function getSessionManager () {
  if (!sessionMiddleware) {
    makeSessionMiddleware()
  }

  return sessionMiddleware
}
