/*
tests

*/

// Basic HTTP routing library
import Express from 'express'

// Authorization token library
import JWT from 'jsonwebtoken'

// Database controller
import { getDBAuthController, getDBTeamController, getDBUserController } from './dbSelector.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:auth')

// Get database auth routes controller object
const authDB = getDBAuthController()

// Get database team routes controller object
const teamDB = getDBTeamController()

const userDB = getDBUserController()

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
      return res.status(403).json({
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

// 1. tests authController validateUser function

router.post('/login', async (req, res) => {
  // Extract and check for required fields
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  try {
    // Attempt to validate user
    const userData = await authDB.validateUser(email, password)

    // Generate token and return
    const token = JWT.sign(userData, process.env.TOKEN_SECRET, {
      subject: 'authorization',
      issuer: 'Karuna',
      audience: userData.email,
      expiresIn: '30d'
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

// 2. test userController emailExists and
// 3. test authController createUser

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
    const existingID = await userDB.emailExists(email)
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
    const userID = await authDB.createUser(firstName, lastName, email, userType, password)
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

// 4. test teamController getTeamList
// T0-DO: currently broken within test.js
// tested within team.js with https://localhost:3000/data/team/list

// List all teamIDs in the database
router.get('/listTeams', authenticateToken, async (req, res) => {
  // Admin users only
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'not authorized' })
  }

  // Attempt to retrieve user list
  try {
    const teamList = teamDB.getTeamList(req.query.perPage, req.query.page)
    req.res(teamList)
  } catch (err) {
    debug('Error retrieving team list')
    debug(err)
    req.status(500).res({ error: true, message: 'error retrieving team list' })
  }
})

// 5. test teamController createTeam

router.post('/registerTeam', async (req, res) => {
  // Extract and check required fields
  const { teamName, unitID, userID } = req.body
  if (!teamName) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // TO-DO? Check if team with the same team name is already registered?

  // Attempt to create user
  debug(`Making team ${teamName}`)
  try {
    const teamID = await teamDB.createTeam(teamName, unitID, userID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error(`Failed to create team ${teamName}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating team' })
  }
})

// 7. test teamController's addToTeam function
// T0-DO: currently broken

router.post('/addToTeam', async (req, res) => {
  // Extract and check required fields
  const { userID, teamID } = req.body
  if (!teamID || !userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // TO-DO: Check if already added to the team

  // Attempt to add user to team
  debug(`adding ${userID} to ${teamID}`)
  try {
    const teamID = await teamDB.addToTeam(userID, teamID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error(`Failed to add ${userID} to team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while adding to team' })
  }
})

// 8. test teamController's createOrgUnit function

router.post('/registerOrg', async (req, res) => {
  // Extract and check required fields
  const { unitName, description, adminID } = req.body
  if (!unitName) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Attempt to create org
  debug(`Creating ${unitName}`)
  try {
    const teamID = await teamDB.createOrgUnit(unitName, description, adminID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error(`Failed to create ${unitName}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating the organization' })
  }
})

// 9. test teamController's removeTeam function
// T0-DO: currently broken

router.post('/removeTeam', async (req, res) => {
  // Extract and check required fields
  const { teamID } = req.body
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to remove team
  debug(`Removing Team ${teamID}`)
  try {
    const teamID = await teamDB.removeTeam(teamID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error(`Failed to remove Team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing Team' })
  }
})

// 10. test teamController's removeOrgUnit function

router.post('/removeOrg', async (req, res) => {
  // Extract and check required fields
  const { unitID } = req.body
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to remove org unit
  debug(`Removing Organizational Unit ${unitID}`)
  try {
    const unit = await teamDB.removeOrgUnit(unitID)
    return res.status(200).json({ message: 'success', unit: unit })
  } catch (error) {
    console.error(`Failed to remove Team ${unitID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing Org Unit' })
  }
})

// 11. test teamController's listTeamsInUnit (unitID, page = 1, perPage = 25) function

router.post('/listTeamsInUnit', async (req, res) => {
  // Extract and check required fields
  const { unitID, page, perPage } = req.body
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to list teams in org unit
  debug(`attempt to list teams in Unit ${unitID}`)
  try {
    const unit = await teamDB.listTeamsInUnit(unitID, page, perPage)
    return res.status(200).json({ message: 'success', unit: unit })
  } catch (error) {
    console.error(`Failed to list teams in org unit ${unitID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while listing teams in org unit' })
  }
})

// 12. test teamController's listTeamsForUser (userID, page = 1, perPage = 25) function

router.post('/listTeamsForUser', async (req, res) => {
  // Extract and check required fields
  const { userID, page, perPage } = req.body
  if (!userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to list teams for user
  debug(`attempting to list teams for user ${userID}`)
  try {
    const user = await teamDB.listTeamsInUnit(userID, page, perPage)
    return res.status(200).json({ message: 'success', user: user })
  } catch (error) {
    console.error(`Failed to list teams in org unit ${userID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while attempting to list teams for user' })
  }
})

// 13. test userController's list user function with listUsers(req.query.fullInfo === undefined, perPage, page)
// done within user.js at https://localhost:3000/data/user/list?fullInfo=true&perPage=10&page=0

// 14. test userController's update user function with updateUser(userID, { firstName, lastName, teams, meta: userMeta })
// done within user.js at https://localhost:3000/data/user/update/

// 15. test userController's promote user function with updateUser(userID, { userType: 'admin' })
// done within user.js at https://localhost:3000/data/user/promote/

// 16. test userController's getUserDetails(userID) function
// done within user.js at https://localhost:3000/data/user/5ff742f09bb9905f98eb348e

// 17. test userController's removeUser (userID) function
router.post('/removeUser', async (req, res) => {
  // Extract and check required fields
  const { userID } = req.body
  if (!userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to remove user
  debug(`attempt to remove user ${userID}`)
  try {
    const user = await userDB.removeUser(userID)
    // if user does not exist, function will succeed
    debug('success: user removed!')
    return res.status(200).json({ message: 'success', user: user })
  } catch (error) {
    console.error(`Failed to remove user ${userID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing user' })
  }
})

// Expose the router for use in other files
export default router
