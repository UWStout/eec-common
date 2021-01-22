// Basic HTTP routing library
import Express from 'express'

// Authorization token library
import JWT from 'jsonwebtoken'

// Database controller
import { getDBAuthController, getDBUserController } from './dbSelector.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:auth')

// Get database auth and user controller objects
const DBAuth = getDBAuthController()
const DBUser = getDBUserController()

// Express middleware to authenticate a user
export function authenticateToken (req, res, next) {
  // Check for cookie first
  let token = req.cookies && req.cookies.JWT
  if (!token) {
    // Try the authorization header next
    const authHeader = req.headers.authorization
    const type = authHeader && authHeader.split(' ')[0]
    token = authHeader && authHeader.split(' ')[1]
    if (!type || type.toLowerCase() !== 'digest' || !token) {
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    }
  }

  // Attempt to verify the token
  JWT.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    }

    // Append payload to the request
    req.user = payload
    next()
  })
}

// Express middleware to authenticate a user
export function decodeToken (req, res, next) {
  // Check for cookie first
  let token = req.cookies && req.cookies.JWT
  if (!token) {
    // Try the authorization header next
    const authHeader = req.headers.authorization
    const type = authHeader && authHeader.split(' ')[0]
    token = authHeader && authHeader.split(' ')[1]
    if (!type || type.toLowerCase() !== 'digest' || !token) {
      req.user = { error: true, message: 'Malformed Token' }
    }
  }

  // Attempt to verify the token
  JWT.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    // Append payload to the request
    req.user = { ...payload }

    // Check for error on verification
    if (err) {
      req.user = { ...req.user, error: true, message: 'Invalid Token' }
    }

    next()
  })
}

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************

router.post('/login', async (req, res) => {
  // Extract and check for required fields
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  try {
    // Attempt to validate user
    const userData = await DBAuth.validateUser(email, password)

    // Set user's successful login timestamp
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    DBUser.updateUserTimestamps(userData.id, address)

    // Generate token and return
    const token = JWT.sign(userData, process.env.TOKEN_SECRET, {
      subject: 'authorization',
      issuer: 'Karuna',
      audience: userData.email,
      expiresIn: '1d'
    })
    return res.status(200).json({ message: 'success', token: token })
  } catch (err) {
    // Something went wrong so log it
    debug('Failed validation')
    debug(err)

    // Respond with invalid
    return res.status(400).json({ invalid: true, message: 'Invalid email or password' })
  }
})

router.post('/register', async (req, res) => {
  // Extract and check required fields
  const { email, firstName, lastName, password } = req.body
  if (!email || !firstName || !lastName || !password) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Optional field (defaults to standard user)
  const userType = req.body.userType || 'standard'

  // Check if user with the same email is already registered
  try {
    const existingID = await DBUser.emailExists(email)
    if (existingID !== -1) {
      return res.status(400).json({
        invalid: true, userID: existingID, message: 'Email already registered'
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: true, message: 'Could not check email'
    })
  }

  // Attempt to create user
  debug(`Making account for ${email}`)
  try {
    const userID = await DBAuth.createUser(firstName, lastName, email, userType, password)
    return res.status(200).json({ message: 'success', userID: userID })
  } catch (error) {
    console.error(`Failed to create account ${email}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating account' })
  }
})

// A simple validation route (returns 200 and 'OK' if token is valid)
router.get('/validate', authenticateToken, (req, res) => {
  res.send('OK')
})

// Expose the router for use in other files
export default router
