// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import * as DBUser from '../mongo/userController.js'

// for testing the database
import MongoDB from 'mongodb'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:user')

// Extract ObjectID for easy usage
const { ObjectID } = MongoDB

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************
// List all users in the database
router.get('/list', authenticateToken, async (req, res) => {
  // Admin users only
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'not authorized' })
  }

  // Try to get the pagination query string values
  const [perPage, page] = UTIL.getPaginationValues(req.query)
  if (isNaN(perPage) || isNaN(page)) {
    return res.status(400).send({ error: true, message: 'Invalid parameter' })
  }

  // Try to get sorting query string values
  const [sortBy, sortOrder] = UTIL.getSortingValues(req.query)

  // Try to get filtering query string values
  const [filterBy, filter] = UTIL.getFilteringValues(req.query)

  // Sanitize any 'false-ish' values to be 'undefined'
  if (req.query.fullInfo === false || req.query.fullInfo === 'false') {
    req.query.fullInfo = undefined
  }

  // Attempt to retrieve user list
  const IDsOnly = (req.query.fullInfo === undefined)
  try {
    const userList = await DBUser.listUsers(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
    res.send(userList)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving user list', res, err, debug)
  }
})

// Update basic user data or metadata (no email, password, or userType)
router.post('/update', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const userID = req.body.id || req.body._id
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
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error updating user', res, err, debug)
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
    // res.send({ success: true })
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error promoting user', res, err, debug)
  }
})

router.get('/details/:id', authenticateToken, async (req, res) => {
  // Read userID from URL params
  const userID = req.params.id
  if (!userID || !ObjectID.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid ID', id: userID })
  }

  // Is this user authorized to see these details
  if (req.user.id !== userID && req.user.type !== 'admin') {
    return res.status(403).send({ error: true, message: 'Not authorized' })
  }

  // Attempt to retrieve user details
  try {
    const userDetails = await DBUser.getUserDetails(userID)
    res.send(userDetails)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving user details', res, err, debug)
  }
})

// 22. test userController's function getUserCount ()
router.get('/count', authenticateToken, async (req, res) => {
  // Attempt to create org
  debug('getting User Count')
  try {
    const userCount = await DBUser.getUserCount()
    return res.json(userCount)
  } catch (error) {
    console.error('Failed to get User Count')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while getting user count' })
  }
})

// 11. test userController's listUsersInTeam (teamID) function
router.get('/listInTeam/:teamID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (!ObjectID.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters', teamID })
    return
  }

  // attempt to list users in the given team
  debug(`attempt to list users in Team ${teamID}`)
  try {
    const users = await DBUser.listUsersInTeam(teamID)
    if (users.error) {
      return res.status(400).json(users)
    }

    if (!users.find((curUser) => (req.user.id === curUser._id.toString()))) {
      return res.status(403).json({ error: true, message: 'You are not a member of that team' })
    }

    return res.json(users)
  } catch (error) {
    console.error(`Failed to list users in team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while listing users in team' })
  }
})

// 16. test userController's removeUser (userID) function
router.delete('/remove', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { userID } = req.body
  if (!userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (userID && !ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove user
  debug(`attempt to remove user ${userID}`)
  try {
    await DBUser.removeUser(userID)
    // if user does not exist, function will succeed
    debug('success: user removed!')
    res.json({ success: true })
  } catch (error) {
    console.error(`Failed to remove user ${userID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing user' })
  }
})

/**
 * API routes for status object
 */
// userControllers function getUserStatus (userID)
router.get('/status/:userID?', authenticateToken, async (req, res) => {
  // Extract and check required fields (fallback to the authorization id if no param)
  const userID = req.params.userID || req.user.id

  // check if userID is a reasonable parameter for ObjectID
  if (userID && !ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get user status
  debug('attempting to get user status')
  try {
    const userStatus = await DBUser.getUserStatus(userID, userID === req.user.id)
    return res.json({ ...userStatus.status })
  } catch (error) {
    debug('Failed to get user status')
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while trying to get user status' })
  }
})

// 34. test userController's function updateUserCollaboration (userID, collaborationStatus)
router.post('/collaboration', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { userID, collaborationStatus } = req.body
  if (!userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if userID is a reasonable parameter for ObjectID
  if (!ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, id: userID, message: 'userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to update user collaboration status
  try {
    await DBUser.updateUserCollaboration(userID, collaborationStatus)
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to update user collaboration status')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while trying to update user collaboration status' })
  }
})

// 35. test userController's function updateUserTimeToRespond (userID, timeToRespond)
router.post('/timeToRespond', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { userID, timeToRespond } = req.body
  if (!userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if userID is a reasonable parameter for ObjectID
  if (!ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, id: userID, message: 'userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // Check individual parts of TTR
  const time = timeToRespond.time || -1
  const units = timeToRespond.units || 'm'
  const automatic = timeToRespond.automatic || false

  // Attempt to update user time to respond
  try {
    await DBUser.updateUserTimeToRespond(userID, time, units, automatic)
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to update user time to respond')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while trying to update user time to respond' })
  }
})

// Expose the router for use in other files
export default router
