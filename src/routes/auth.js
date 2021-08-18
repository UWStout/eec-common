// Basic HTTP routing library
import Express from 'express'

// Authorization token library
import JWT from 'jsonwebtoken'

// Database controller
import * as DBUser from '../mongo/userController.js'
import * as DBAuth from '../mongo/authController.js'

// Rate limiting middleware
import rateLimiter from '../rateLimiter.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:auth_routes')

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
// This one will be rate limited (as these are authentication routes)
const router = new Express.Router()
router.use(rateLimiter('authRoutes', 3, 10))

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
    return res.json(token)
  } catch (err) {
    // Something went wrong so log it
    debug('Failed validation')

    // Respond with invalid
    return res.status(400).json({ invalid: true, message: 'Invalid email or password' })
  }
})

router.post('/register', async (req, res) => {
  // Extract and check required fields
  const { email, fullName, preferredName, preferredPronouns, password } = req.body
  if (!email || !fullName || !preferredName || !password) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Check if user with the same email is already registered
  try {
    const existingID = await DBUser.emailExists(email)
    if (existingID !== -1) {
      return res.status(400).json({
        invalid: true, exists: true, userID: existingID, message: 'Email already registered'
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
    const userID = await DBAuth.createUser(fullName, preferredName, email, password, preferredPronouns)
    return res.json(userID)
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
