// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken, generateNewToken } from './auth.js'

// Database controller
import * as DBUser from '../mongo/userController.js'

// for testing the database
import MongoDB from 'mongodb'

// Utility functions
import * as UTIL from './utils.js'

// Allow interaction with the socket.io server
import { userInfoUpdated, userStatusUpdated } from '../sockets/clientEngine.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:user')

// Extract ObjectId for easy usage
const { ObjectId } = MongoDB

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

// Update basic user data or metadata (not password or userType)
router.post('/update', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const userID = req.body.id || req.body._id
  if (!userID || !req.user.id) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID' })
  }

  // Disallow updating of password or userType with this endpoint
  if (req.body.password || req.body.passwordHash || req.body.userType) {
    return res.status(400).send({ error: true, message: 'Cannot update password or userType' })
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
    const name = req.body.name || userDetails.name
    const preferredName = req.body.preferredName || userDetails.preferredName
    const preferredPronouns = req.body.preferredPronouns || userDetails.preferredPronouns
    const email = req.body.email || userDetails.email

    // If changing email, confirm not already in use
    if (email !== userDetails.email) {
      const existingID = await DBUser.emailExists(email)
      if (existingID !== -1) {
        // 409 = CONFLICT
        return res.status(409).json({
          invalid: true, exists: true, message: 'Email already registered'
        })
      }
    }

    // Merge any changes to 'meta' (and sanitize non-object meta values)
    if (typeof userDetails.meta !== 'object') { userDetails.meta = {} }
    const userMeta = { ...userDetails.meta, ...req.body.meta }

    // Sanitize non-array teams values and union with existing teams
    if (!Array.isArray(userDetails.teams)) { userDetails.teams = [] }

    // Build unique list of teams (avoid duplicates)
    const teamSet = new Set(userDetails.teams)
    if (Array.isArray(req.body.teams)) {
      req.body.teams.forEach((newTeam) => {
        if (!teamSet.has(newTeam)) { teamSet.add(newTeam) }
      })
    }

    // Ensure teams is an array and all are are ObjectId objects
    const teams = Array.from(teamSet).map((curTeamID) => (new ObjectId(curTeamID)))

    // Update the user in the DB
    await DBUser.updateUser(userID, {
      name, preferredName, preferredPronouns, email, teams, meta: userMeta
    })

    // Regenerate and return new token
    try {
      const newToken = await generateNewToken(req.user, req.token)
      res.json(newToken) // Deliberately fall through
    } catch (err) {
      debug('Error rolling over token:', err)
      res.status(500).json({
        error: true, message: 'Failed to update token'
      }) // Deliberately fall through
    }

    // Broadcast update to all connected sockets
    userInfoUpdated(userID)
  } catch (err) {
    UTIL.checkAndReportError('Error updating user', res, err, debug)
  }
})

router.post('/update/alias', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const userID = req.body.id || req.body._id
  if (!userID || !req.user.id) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID' })
  }

  // Ensure this is an authorized update (self-update or 'admin' user only)
  debug(`User "${req.user.id}" wants to update "${userID}" and they are a/an "${req.user.userType}" user`)
  if (req.user.id !== userID && req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Cannot update other users' })
  }

  // Check post data
  const context = req.body.context
  if (!context || (context !== 'msTeams' && context !== 'discord' && context !== 'slack')) {
    return res.status(400).send({ error: true, message: 'invalid context' })
  }

  if (!req.body.aliasId && !req.body.aliasName && !req.body.avatarURL) {
    return res.status(400).send({ error: true, message: 'At least one of aliasId, aliasName, and avatarURL must be included' })
  }

  try {
    // Attempt to retrieve current user details
    const userDetails = await DBUser.getUserDetails(userID)

    // Update values or fall-back to previous value
    const aliasId = req.body.aliasId || userDetails.contextId[context]
    const aliasName = req.body.aliasName || userDetails.contextName[context]
    const avatarURL = req.body.avatarURL || userDetails.contextAvatar[context]

    // Update the user in the DB
    await DBUser.setUserAlias(userID, context, aliasId, aliasName, avatarURL)
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error setting user alias info', res, err, debug)
  }
})

// Update promote a standard user into an admin
router.post('/promote', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const userID = req.body.id
  const newType = req.body.newType
  if (!userID || (newType !== 'admin' && newType !== 'manager') || !req.user.id) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID / promotion type' })
  }

  // Ensure this is an authorized update (self-update or 'admin' user only)
  debug(`User "${req.user.id}" wants to promote "${userID}" to a "${newType}" and they are a/an "${req.user.userType}" user`)
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Only admins can promote users' })
  }

  // Update the user to 'admin' or 'manager' type
  try {
    await DBUser.updateUser(userID, { userType: newType })
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error promoting user', res, err, debug)
  }
})

router.get('/details/:id', authenticateToken, async (req, res) => {
  // Read userID from URL params
  const userID = req.params.id
  if (!userID || !ObjectId.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid ID', id: userID })
  }

  // Is this user authorized to see these details
  if (req.user.id !== userID && req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'You can only view your own details unless you are an admin' })
  }

  // Attempt to retrieve user details
  try {
    const userDetails = await DBUser.getUserDetails(userID)
    res.send(userDetails)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving user details', res, err, debug)
  }
})

// Retrieve settings
router.get('/settings', authenticateToken, async (req, res) => {
  // Read userID from token
  const userID = req.user.id
  if (!userID || !ObjectId.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid ID', id: userID })
  }

  // Attempt to retrieve user settings
  try {
    const userSettings = await DBUser.getUserSettings(userID)
    res.send(userSettings)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving user settings', res, err, debug)
  }
})

// Update settings
router.post('/settings', authenticateToken, async (req, res) => {
  // Read userID from token
  const userID = req.user.id
  if (!userID || !ObjectId.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid ID', id: userID })
  }

  try {
    // Attempt to retrieve current user settings
    const userSettings = await DBUser.getUserSettings(userID)

    // Build new user settings
    const newSettings = {
      enableMoodPrompt: (typeof req.body.enableMoodPrompt === 'boolean' ? req.body.enableMoodPrompt : userSettings.enableMoodPrompt),
      enablePrivacyPrompt: (typeof req.body.enablePrivacyPrompt === 'boolean' ? req.body.enablePrivacyPrompt : userSettings.enablePrivacyPrompt),
      alwaysShare: (typeof req.body.alwaysShare === 'boolean' ? req.body.alwaysShare : userSettings.alwaysShare),
      enableJITStatus: (typeof req.body.enableJITStatus === 'boolean' ? req.body.enableJITStatus : userSettings.enableJITStatus),
      enableMessageFeedback: (typeof req.body.enableMessageFeedback === 'boolean' ? req.body.enableMessageFeedback : userSettings.enableMessageFeedback),
      enableAutoTTR: (typeof req.body.enableAutoTTR === 'boolean' ? req.body.enableAutoTTR : userSettings.enableAutoTTR)
    }

    // Update user settings in the DB
    await DBUser.updateUserSettings(userID, newSettings)
    res.send({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error updating user settings', res, err, debug)
  }
})

router.post('/alias_lookup', authenticateToken, async (req, res) => {
  // Check for and validate provided context
  const context = req.body.context
  if (!context) {
    return res.status(400).send({ error: true, message: 'messaging context required' })
  } else if (context !== 'msTeams' && context !== 'discord' && context !== 'slack') {
    return res.status(400).send({ error: true, message: `Invalid context "${context}"` })
  }

  // Read alias from URL params
  if (!req.body.alias) {
    return res.status(400).send({ error: true, message: 'alias list missing' })
  }

  // Extract as array of values
  const aliasList = (!Array.isArray(req.body.alias) ? [req.body.alias] : req.body.alias)

  // Put limit on size of request
  if (aliasList.lenth > 100) {
    return res.status(400).send({ error: true, message: 'max list size exceeded' })
  }

  // Attempt to retrieve user details
  try {
    const userIDs = await DBUser.getIdsFromAliasList(context, aliasList)
    res.send(userIDs)
  } catch (err) {
    UTIL.checkAndReportError('Error looking up ids from alias', res, err, debug)
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

router.get('/teams/', authenticateToken, async (req, res) => {
  // Read userID from authorization params
  const userID = req.user.id
  if (!userID || !ObjectId.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid ID', id: userID })
  }

  // Attempt to retrieve user details
  try {
    const userTeamDetails = await DBUser.getUserTeams(userID)
    res.send(userTeamDetails)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving user team details', res, err, debug)
  }
})

router.get('/memberOfTeam/:teamID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectId (hexadecimal)
  if (!ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters', teamID })
    return
  }

  // attempt to list users in the given team
  debug(`attempt to check membership in team ${teamID}`)
  try {
    const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
    return res.json({ member: isMember })
  } catch (error) {
    console.error('Failed to check membership')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while checking team membership' })
  }
})

router.get('/listInTeam/:teamID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectId (hexadecimal)
  if (!ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters', teamID })
    return
  }

  // Is this allowed?
  const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
  if (!isMember && req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Must be on team or be an admin' })
  }

  // attempt to list users in the given team
  debug(`attempt to list users in Team ${teamID}`)
  try {
    const users = await DBUser.listUsersInTeam(teamID)
    if (users.error) {
      return res.status(400).json({ error: true, message: 'Failed to list team members' })
    }

    return res.json(users)
  } catch (error) {
    console.error(`Failed to list users in team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while listing users in team' })
  }
})

// 16. test userController's removeUser (userID) function
router.delete('/remove/:userID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const userID = req.params.userID
  if (!userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Make sure you don't delete your own account (which is the ID for the token in use)
  if (userID === req.user.id) {
    res.status(400).json({ invalid: true, message: 'You may not remove your own account' })
    return
  }

  // check if userID is a reasonable parameter for ObjectId (hexadecimal)
  if (userID && !ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
    return
  }

  // Is this allowed?
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Only admins can remove accounts' })
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

  // check if userID is a reasonable parameter for ObjectId
  if (userID && !ObjectId.isValid(userID)) {
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

  // Is this user authorized to do this
  if (req.user.id !== userID) {
    return res.status(403).send({ error: true, message: 'You can only update your own status' })
  }

  // check if userID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, id: userID, message: 'userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to update user collaboration status
  try {
    await DBUser.updateUserCollaboration(userID, collaborationStatus)
    userStatusUpdated(userID) // runs async, but no need to await
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

  // Is this user authorized to do this
  if (req.user.id !== userID) {
    return res.status(403).send({ error: true, message: 'You can only update your own status' })
  }

  // check if userID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, id: userID, message: 'userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // Check individual parts of TTR
  let time = timeToRespond.time || 0
  const units = timeToRespond.units || 'm'
  const automatic = timeToRespond.automatic || false

  if (typeof time !== 'number' || time < 0) { time = 0 }

  // Attempt to update user time to respond
  try {
    await DBUser.updateUserTimeToRespond(userID, time, units, automatic)
    userStatusUpdated(userID) // runs async, but no need to await
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to update user time to respond')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while trying to update user time to respond' })
  }
})

// Expose the router for use in other files
export default router
