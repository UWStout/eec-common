import Express from 'express'
import bcrypt from 'bcrypt'

// How many rounds to use when generating salt
const SALT_ROUNDS = 10

// Temporary user data for testing
const users = [{
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@email.com',
  password: '$2b$10$MSN/FDQAWJC9aJJ40Ewav.xRIzTUkjutfLFUrcVZ9daz0sogbIodq'
}]

// Create a router to attach to an express server app
const router = new Express.Router()

// API routes
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
