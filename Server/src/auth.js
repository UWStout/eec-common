import Express from 'express'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

// How many rounds to use when generating salt
const SALT_ROUNDS = 10

// Temporary user data for testing
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@email.com',
    type: 'standard',
    password: '$2b$10$MSN/FDQAWJC9aJJ40Ewav.xRIzTUkjutfLFUrcVZ9daz0sogbIodq'
  }, {
    firstName: 'Seth',
    lastName: 'Berrier',
    email: 'berriers@uwstout.edu',
    type: 'admin',
    password: '$2b$10$MSN/FDQAWJC9aJJ40Ewav.xRIzTUkjutfLFUrcVZ9daz0sogbIodq'
  }
]

// Express middleware to authenticate a user
export function authenticateToken (req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    return res.status(401).json({
      error: true, message: 'not authorized'
    })
  }

  // Attempt to verify the token
  JWT.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        error: true, message: 'not authorized'
      })
    }

    // Append payload to the request
    req.user = payload
    next()
  })
}

// Create a router to attach to an express server app
const router = new Express.Router()

// API routes
router.post('/login', async (req, res) => {
  // Extract and check required fields
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Lookup user
  const userData = users.find((user) => { return user.email === email })
  if (!userData) {
    res.status(400).json({ invalid: true, message: 'Invalid email or password' })
    return
  }

  // Compare plain-text password with hashed password
  const success = await bcrypt.compare(password, userData.password)
  if (success) {
    userData.password = undefined
    const token = JWT.sign({ ...userData }, process.env.TOKEN_SECRET, {
      subject: 'authorization', issuer: 'Karuna', audience: userData.email, expiresIn: '30d'
    })
    res.status(200).json({ message: 'success', token: token })
  }
})

router.post('/register', async (req, res) => {
  // Extract and check required fields
  const { email, firstName, lastName, password } = req.body
  if (!email || !firstName || !lastName || !password) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Check if user with the same email is already registered
  if (users.find(user => user.email === email)) {
    res.status(400).json({ invalid: true, message: 'Email already registered' })
    return
  }

  // Hash password and store user
  console.log(`Making account for ${email}`)
  try {
    // Hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)
    console.log(`Hashed password: ${hash}`)

    // Store new user
    users.push({
      firstName,
      lastName,
      email,
      password: hash
    })
    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error(`Failed to has password while creating account for ${email}`)
    console.error(error)
    res.status(500).json({ error: true, message: 'Error while storing account' })
  }
})

// Expose the router for use in other files
export default router
