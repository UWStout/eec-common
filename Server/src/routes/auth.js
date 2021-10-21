// Basic HTTP routing library
import Express from 'express'

// Basic file io
import fs from 'fs'

// Authorization token library
import JWT from 'jsonwebtoken'

// Date handling library
import moment from 'moment'

// Database controller
import * as DBUser from '../mongo/userController.js'
import * as DBAuth from '../mongo/authController.js'
import * as DBToken from '../mongo/tokenController.js'

// Rate limiting middleware
import rateLimiter from '../rateLimiter.js'

// For checking mongo objectIDs
import MongoDB from 'mongodb'

// For sending emails
import { sendEmail } from '../email/emailHelper.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:auth_routes')

// Are we in development mode?
const _DEV_ = (process.argv.find((arg) => { return arg === 'dev' }))
const DEV_SERVER = 'localhost:3000'
const PROD_SERVER = 'karuna.run'

// Constants for validation emails
const VERIFY_SUBJECT = 'Karuna Email Verification'
const VERIFY_BODY_TEXT = fs.readFileSync('./src/email/verify.md', { encoding: 'utf8' })

const RECOVERY_SUBJECT = 'Karuna Account Recovery'
const RECOVERY_BODY_TEXT = fs.readFileSync('./src/email/recovery.md', { encoding: 'utf8' })

// Express middleware to authenticate a user
export function authenticateToken (req, res, next) {
  // Try the authorization header first
  const authHeader = req.headers.authorization
  const type = authHeader && authHeader.split(' ')[0]
  let token = authHeader && authHeader.split(' ')[1]
  if (token && (!type || type.toLowerCase() !== 'digest')) {
    return res.status(401).json({
      error: true, message: 'not authorized'
    })
  }

  // If no auth digest/token, try cookies instead
  if (!token) {
    token = req.cookies && req.cookies.JWT
    if (!token) {
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    }
  }

  // Attempt to verify the token
  JWT.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    // Verification failed
    if (err) {
      debug('Token failed authorization:', err)
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    }

    // Is the token in the allowed list?
    DBToken.findToken(payload.id || payload._id, token).then(
      () => {
        // Append payload to the request
        req.user = { ...payload }
        req.token = token
        return next()
      }
    ).catch((err) => {
      debug('Error finding token:', err)
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    })
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
    req.token = token

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

  // Sanitize "expires"
  let expiration = req.body.expiration
  if (typeof expiration !== 'number') { expiration = 24 } // default 1 day
  if (expiration < 1) { expiration = 1 } // min 1 hour
  if (expiration > 168) { expiration = 168 } // max 7 days

  try {
    // Attempt to validate user
    const userData = await DBAuth.validateUser(email, password)

    // Set user's successful login timestamp
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    DBUser.updateUserTimestamps(userData.id, address)

    // Generate token, save it, and return it
    const token = JWT.sign(userData, process.env.TOKEN_SECRET, {
      subject: 'authorization',
      issuer: 'Karuna',
      audience: userData.email,
      expiresIn: `${expiration}h`
    })
    await DBToken.addToken(userData.id, token, moment().add(expiration, 'h').toDate())
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

// A route to check if an email is already registered
router.post('/email', async (req, res) => {
  // Extract and check required fields
  const { email } = req.body
  if (!email) {
    res.status(400).json({ invalid: true, message: 'Missing email to check' })
    return
  }

  // Check if user with the same email is already registered
  try {
    const existingID = await DBUser.emailExists(email)
    if (existingID !== -1) {
      // 409 = CONFLICT
      return res.status(409).json({
        invalid: true, exists: true, message: 'Email already registered'
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: true, message: 'Could not check email'
    })
  }

  // All is well
  res.status(200).json({ message: 'OK' })
})

/* Email verification route */
router.post('/verify', async (req, res) => {
  // Ensure email was provided
  const email = req.body.email
  if (!email) {
    debug('Missing email for verification')
    return res.status(400).send({ error: true, message: 'Missing required field' })
  }

  // Check if user with the same email is registered
  try {
    const { _id: existingID } = await DBUser.emailExists(email)
    if (MongoDB.ObjectId.isValid(existingID)) {
      // Retrieve full user info
      const userInfo = await DBUser.getUserDetails(existingID)
      if (!userInfo.emailVerified) {
        // Generate verification token
        const verificationToken = JWT.sign(
          { id: existingID },
          process.env.TOKEN_SECRET,
          { expiresIn: '48h', noTimestamp: true }
        )

        // Send recovery link via email
        userInfo.serverURL = (_DEV_ ? DEV_SERVER : PROD_SERVER)
        userInfo.verificationToken = encodeURIComponent(verificationToken)
        const success = await sendEmail(userInfo, VERIFY_SUBJECT, VERIFY_BODY_TEXT)

        // Store token and email activity in DB
        if (success) {
          await DBUser.updateEmailTimestamp(existingID, 'verify', verificationToken)
          return res.send({ status: 'ok' })
        }
      }
    }

    // We send ok regardless of weather the email was found or account was already verified
    // NOTE: We wait a bit so as to slow down the user (in a naive way)
    setTimeout(() => { return res.send({ status: 'ok' }) }, 5000)
    return
  } catch (err) {
    return res.status(500).json({
      error: true, message: 'Could not check email'
    })
  }
})

/* Account recovery route */
router.post('/recover', async (req, res) => {
  // Ensure email was provided
  const email = req.body.email
  if (!email) {
    debug('Missing email for recovery')
    return res.status(400).send({ error: true, message: 'Missing required field' })
  }

  // Check if user with the same email is already registered
  try {
    const { _id: existingID } = await DBUser.emailExists(email)
    if (MongoDB.ObjectId.isValid(existingID)) {
      // Lookup full user info
      const userInfo = await DBUser.getUserDetails(existingID)

      // Generate recovery token
      const recoveryToken = JWT.sign(
        { id: existingID },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h', noTimestamp: true }
      )

      // Send recovery link via email
      userInfo.serverURL = (_DEV_ ? DEV_SERVER : PROD_SERVER)
      userInfo.recoveryToken = encodeURIComponent(recoveryToken)
      const success = await sendEmail(userInfo, RECOVERY_SUBJECT, RECOVERY_BODY_TEXT)

      // Store token and email activity in DB
      if (success) {
        await DBUser.updateEmailTimestamp(existingID, 'recovery', recoveryToken)
        return res.send({ status: 'ok' })
      }
    }

    // We send ok regardless of weather the email was found
    // NOTE: We wait a bit so as to slow down the user (in a naive way)
    setTimeout(() => { return res.send({ status: 'ok' }) }, 5000)
  } catch (err) {
    return res.status(500).json({
      error: true, message: 'Could not check email'
    })
  }
})

router.post('/setNewPassword', async (req, res) => {
  // Extract and check required fields
  const { token, password } = req.body
  if (!token || !password) {
    return res.status(400).json({
      invalid: true, message: 'Missing required information'
    })
  }

  // Validate the token
  JWT.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
    // Check for any errors
    if (err) {
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    }

    // Try to update password
    try {
      const success = await DBAuth.updatePassword(payload.id, token, password)
      if (success) {
        return res.send({ status: 'ok' })
      }
    } catch (error) {
      console.error('Failed to update password')
      console.error(error)
    }

    // Report generic error (presumably internal)
    return res.status(500).json({
      error: true, message: 'Error updating password'
    })
  })
})

router.post('/validateEmail', async (req, res) => {
  // Extract and check required fields
  const { token } = req.body
  if (!token) {
    return res.status(400).json({
      invalid: true, message: 'Missing required information'
    })
  }

  // Validate the token
  JWT.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
    // Check for any errors
    if (err) {
      return res.status(401).json({
        error: true, message: 'not authorized'
      })
    }

    // Try to set validation in DB
    try {
      const success = await DBAuth.validateEmail(payload.id, token)
      if (success) {
        return res.send({ status: 'ok' })
      }
    } catch (error) {
      console.error('Failed to validate email')
      console.error(error)
    }

    // Report generic error (presumably internal)
    return res.status(500).json({
      error: true, message: 'Error validating email'
    })
  })
})

// A simple validation route (returns 200 and 'OK' if token is valid)
router.get('/validate', authenticateToken, (req, res) => {
  res.send('OK')
})

// A route to expire and rollover a token
router.get('/rollover', authenticateToken, async (req, res) => {
  const payloadData = req.user
  try {
    // Retrieve user's latest details and merge with payload data
    const userData = await DBAuth.userBasics(payloadData.id)

    // Generate new token with merged data
    const newToken = JWT.sign({ ...payloadData, ...userData }, process.env.TOKEN_SECRET)

    // Overwrite previous token in DB and return new one
    await DBToken.updateToken(payloadData.id, req.token, newToken)
    return res.json(newToken)
  } catch (err) {
    debug('Error rolling over token:', err)
    return res.status(500).json({
      error: true, message: 'Failed to update token'
    })
  }
})

// A simple logout route (removes the token from the DB)
router.get('/logout', authenticateToken, async (req, res) => {
  try {
    // Delete the token used from the list
    await DBToken.removeToken(req.user.id, req.token)
    return res.json({ status: 'ok' })
  } catch (err) {
    debug('Error removing token:', err)
    return res.status(500).json({
      error: true, message: 'Failed log out'
    })
  }
})

// Expose the router for use in other files
export default router
