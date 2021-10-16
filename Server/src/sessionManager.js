// Middleware for managing a user session and storing it in our mongodb
import session from 'express-session'
import MongoStore from 'connect-mongo'

import cookie from 'cookie'
import uid from 'uid-safe'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// Reuse our existing mongodb client connection
import { getClientPromise } from './mongo/connect.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:session_manager')

// Update environment variables
dotenv.config()
const SESSION_SECRET = process.env.SESSION_SECRET || 'qwertyuiop[]'

// Exclude these token payload props from the session
export const EXCLUDED_TOKEN_PROPS = [
  'iat', 'exp', 'aud', 'iss', 'sub'
]

// Cached session middleware
let sessionMiddleware = null

// Function to initialize the session middleware
function makeSessionMiddleware () {
  sessionMiddleware = session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      clientPromise: getClientPromise(),
      dbName: 'karunaSessions',
      touchAfter: 0 // time period in seconds
    }),

    // Make our own sessionIDs from user ID and IP address
    genid: (req) => {
      const myId = extractIdFromToken(req.headers.authorization, req.headers.cookie)
      const address = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
      if (!myId) {
        return uid.sync(18) + address
      } else {
        return myId + address
      }
    }
  })
}

// Retrieve the internally cached session middleware
export function getSessionMiddleware () {
  if (!sessionMiddleware) {
    makeSessionMiddleware()
  }

  return sessionMiddleware
}

function extractIdFromToken (auth, cookies) {
  let token = ''

  if (auth) {
    // Look for token in auth header
    token = auth.split(' ')[1]
  } else {
    // Look for token in cookies
    try {
      const cookieObj = cookie.parse(cookies)
      token = cookieObj?.JWT
    } catch (err) {}
  }

  // Did we find a token?
  if (token) {
    try {
      // Decode the token payload (CAUTION: does not check signature)
      const jsonStr = Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
      const userObj = JSON.parse(jsonStr)
      return userObj?.id
    } catch (err) {}
  }

  // Something went wrong
  return undefined
}
