// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import { getDBUserController } from './dbSelector.js'

// Utility functions
import { getPaginationValues, checkAndReportError } from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:user')

// Get database auth and user controller objects
const DBUser = getDBUserController()

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************
// List all userIDs in the database
router.get('/list', authenticateToken, async (req, res) => {
  // Admin users only
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'not authorized' })
  }

  // Try to get the pagination query string values
  const [perPage, page] = getPaginationValues(req.query)
  if (isNaN(perPage) || isNaN(page)) {
    return res.status(400).send({ error: true, message: 'Invalid parameter' })
  }

  // Sanitize any 'false-ish' values to be 'undefined'
  if (req.query.fullInfo === false || req.query.fullInfo === 'false') {
    req.query.fullInfo = undefined
  }

  // Attempt to retrieve user list
  try {
    const userList = await DBUser.listUsers(req.query.fullInfo === undefined, perPage, page)
    res.send(userList)
  } catch (err) {
    checkAndReportError('Error retrieving user list', res, err, debug)
  }
})

// Update basic user data or metadata (no email, password, or userType)
router.post('/update', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const userID = req.body.id
  if (!userID || !req.user.id) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID' })
  }

  // Disallow updating of password, email, or userType with this endpoint
  if (req.body.password || req.body.email || req.body.userType) {
    return res.status(400).send({ error: true, message: 'Cannot update password, email, or userType' })
  }

  // Ensure this is an authorized update (self-update or 'admin' user only)
  debug(`User "${req.user.id}" wants to update "${userID}" and they are a/an "${req.user.userType}" user`)
  if (req.user.id !== userID && req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Cannot update other users' })
  }

  try {
    // Attempt to retrieve current user details
    const userDetails = await DBUser.getUserDetails(userID)

    // Update values or fall-back to previous value
    const firstName = req.body.firstName || userDetails.firstName
    const lastName = req.body.lastName || userDetails.lastName

    // Merge any changes to 'meta' (and sanitize non-object meta values)
    if (typeof userDetails.meta !== 'object') { userDetails.meta = {} }
    const userMeta = { ...userDetails.meta, ...req.body.meta }

    // Sanitize non-array teams values and union with existing teams
    if (!Array.isArray(userDetails.teams)) { userDetails.teams = [] }
    let teams = [...userDetails.teams]
    if (Array.isArray(req.body.teams)) {
      const uniqueTeams = req.body.teams.filter((item) => userDetails.teams.indexOf(item) < 0)
      teams = [...teams, ...uniqueTeams]
    }

    // Update the user in the DB
    await DBUser.updateUser(userID, { firstName, lastName, teams, meta: userMeta })
    res.send({ success: true })
  } catch (err) {
    checkAndReportError('Error updating user', res, err, debug)
  }
})

// Update promote a standard user into an admin
router.post('/promote', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const userID = req.body.id
  if (!userID || !req.user.id) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID' })
  }

  // Ensure this is an authorized update (self-update or 'admin' user only)
  debug(`User "${req.user.id}" wants to promote "${userID}" and they are a/an "${req.user.userType}" user`)
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Only admins can promote users' })
  }

  // Update the user to 'admin' type
  try {
    await DBUser.updateUser(userID, { userType: 'admin' })
    res.send({ success: true })
  } catch (err) {
    checkAndReportError('Error promoting user', res, err, debug)
  }
})

router.get('/:id', async (req, res) => {
  // Attempt to retrieve user ID
  const userID = req.params.id
  if (!userID) {
    return res.status(400).send({ error: true, message: 'Invalid ID', id: userID })
  }

  // Attempt to retrieve user details
  try {
    const userDetails = await DBUser.getUserDetails(userID)
    res.send(userDetails)
  } catch (err) {
    checkAndReportError('Error retrieving user details', res, err, debug)
  }
})

// Expose the router for use in other files
export default router
