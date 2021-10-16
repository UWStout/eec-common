// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controllers
import * as DBUser from '../mongo/userController.js'
import * as DBTeam from '../mongo/teamController.js'

// for testing the database
import MongoDB from 'mongodb'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:user_routes')

// Extract ObjectId for easy usage
const { ObjectId } = MongoDB

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************
// List all teams in the database
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
    const userList = await DBTeam.listTeams(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
    res.send(userList)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving user list', res, err, debug)
  }
})

// Update team data
router.post('/update', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const teamID = req.body.id || req.body._id
  if (!teamID) {
    return res.status(400).send({ error: true, message: 'Invalid or missing team ID' })
  }

  // Ensure this is an authorized update
  const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
  if (!isMember && req.user.userType !== 'admin') {
    debug(`Unauthorized team update by user "${req.user.id}" of team "${teamID}"`)
    return res.status(403).send({ error: true, message: 'You must be on the team or be an admin to update a team' })
  }

  try {
    // Attempt to retrieve current user details
    const teamDetails = await DBTeam.getTeamDetails(teamID)

    // Update values or fall-back to previous value
    const name = req.body.name || teamDetails.name
    const description = req.body.description || teamDetails.description
    const culture = req.body.culture || teamDetails.culture
    const commModelLink = req.body.commModelLink || teamDetails.commModelLink
    const orgId = (req.body.orgId === undefined ? teamDetails.orgId : req.body.orgId)

    // Update the team in the DB
    await DBTeam.updateTeam(teamID, { name, description, culture, commModelLink, orgId })
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error updating team', res, err, debug)
  }
})

// Update team manager list
router.post('/addManager', authenticateToken, async (req, res) => {
  // Attempt to retrieve teamID
  const teamID = req.body.teamID
  if (!teamID || !ObjectId.isValid(teamID)) {
    return res.status(400).send({ error: true, message: 'Invalid or missing team ID' })
  }

  const userID = req.body.userID || req.user.id
  if (!userID || !ObjectId.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID' })
  }

  // Ensure this is an authorized update
  const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
  const isManager = await DBTeam.managerOfTeam(req.user.id, teamID)
  if ((!isMember || !isManager) && req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'You must be a team manager or be an admin to add a team manager' })
  }

  // Is the indicated ID already a manager
  if (await DBTeam.managerOfTeam(userID, teamID)) {
    return res.json({ success: true })
  }

  try {
    // Attempt to retrieve current user details
    const teamDetails = await DBTeam.getTeamDetails(teamID)

    // Add new userID to the managers list
    const managers = teamDetails.managers || []
    if (!managers.includes(new ObjectId(userID))) {
      managers.push(new ObjectId(userID))
    }

    // Update the team in the DB
    await DBTeam.updateTeam(teamID, { managers })
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error adding team manager', res, err, debug)
  }
})

// Update team manager list
router.post('/removeManager', authenticateToken, async (req, res) => {
  // Attempt to retrieve teamID
  const teamID = req.body.teamID
  if (!teamID || !ObjectId.isValid(teamID)) {
    return res.status(400).send({ error: true, message: 'Invalid or missing team ID' })
  }

  const userID = req.body.userID || req.user.id
  if (!userID || !ObjectId.isValid(userID)) {
    return res.status(400).send({ error: true, message: 'Invalid or missing user ID' })
  }

  // Ensure this is an authorized update
  const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
  const isManager = await DBTeam.managerOfTeam(req.user.id, teamID)
  if ((!isMember || !isManager) && req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'You must be a team manager or be an admin to add a team manager' })
  }

  // Is the indicated ID NOT a manager
  if (!(await DBTeam.managerOfTeam(userID, teamID))) {
    return res.json({ success: true })
  }

  try {
    // Attempt to retrieve current user details
    const teamDetails = await DBTeam.getTeamDetails(teamID)

    // Remove user ID from managers list
    const managers = teamDetails.managers || []
    const index = managers.indexOf(new ObjectId(userID))
    if (index >= 0) {
      managers.splice(index, 1)

      // Update the team in the DB
      await DBTeam.updateTeam(teamID, { managers })
    }

    // Indicate success
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error adding team manager', res, err, debug)
  }
})

// 5. test teamController createTeam
router.post('/register', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { name, description, unitID, userID } = req.body
  if (!name) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if unitID is a reasonable parameter for ObjectId (hexadecimal)
  if (unitID && !ObjectId.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // check if userID is a reasonable parameter for ObjectId (hexadecimal)
  if (userID && !ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // Attempt to create team
  debug(`Making team ${name}`)
  try {
    await DBTeam.createTeam(name, description, unitID, userID)
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to create team ${name}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating team' })
  }
})

// 6. test teamController's addToTeam function: works!
// router.post('/addUser', authenticateToken, async (req, res) => {
//   // Extract and check required fields
//   const { userID, teamID } = req.body
//   if (!teamID || !userID) {
//     res.status(400).json({ invalid: true, message: 'Missing required information' })
//     return
//   }

//   // check if teamID is a reasonable parameter for ObjectId (hexadecimal)
//   if (teamID && !ObjectId.isValid(teamID)) {
//     res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
//   }

//   // check if userID is a reasonable parameter for ObjectId (hexadecimal)
//   if (userID && !ObjectId.isValid(userID)) {
//     res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
//   }

//   // TO-DO: Check if already added to the team?

//   // Attempt to add user to team
//   debug(`adding ${userID} to ${teamID}`)
//   try {
//     await DBTeam.addToTeam(userID, teamID)
//     return res.json({ success: true })
//   } catch (error) {
//     console.error(`Failed to add ${userID} to team ${teamID}`)
//     console.error(error)
//     return res.status(500).json({ error: true, message: 'Error while adding to team' })
//   }
// })

// 8. test teamController's removeTeam function: works!
router.delete('/remove/:teamID', authenticateToken, async (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ invalid: true, message: 'Only admins can remove teams' })
  }

  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectId (hexadecimal)
  if (teamID && !ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove team
  debug(`Removing Team ${teamID}`)
  try {
    await DBTeam.removeTeam(teamID)
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to remove Team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing Team' })
  }
})

// 10. test teamController's listTeamsInUnit (unitID) function
router.get('/listInUnit/:unitID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const unitID = req.params.unitID
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  if (unitID && !ObjectId.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to list teams in org unit
  debug(`attempt to list teams in Unit ${unitID}`)
  try {
    const teams = await DBTeam.listTeamsInUnit(unitID)
    return res.json(teams)
  } catch (error) {
    console.error(`Failed to list teams in org unit ${unitID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while listing teams in org unit' })
  }
})

// 18. test teamControllers getTeamDetails (teamID)
// tested within update function at https://localhost:3000/data/team/details
router.get('/details/:teamID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectId (hexadecimal)
  if (teamID && !ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
    return
  }

  // Ensure this is an authorized update
  const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
  if (!isMember && req.user.userType !== 'admin') {
    debug(`Unauthorized attempt to list team details by user "${req.user.id}" of team "${teamID}"`)
    return res.status(403).send({ error: true, message: 'You must be on the team or be an admin to see details' })
  }

  // attempt to get team details
  debug(`attempting to get team details ${teamID}`)
  try {
    const team = await DBTeam.getTeamDetails(teamID)
    return res.json(team)
  } catch (error) {
    debug(`Failed to get team details ${teamID}`)
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while getting team details' })
  }
})

router.get('/getTeamAffectTemperature/:teamID', authenticateToken, async (req, res) => {
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

  // Ensure this is an authorized update
  const isMember = await DBUser.memberOfTeam(req.user.id, teamID)
  if (!isMember && req.user.userType !== 'admin') {
    debug(`Unauthorized attempt to list team temperature by user "${req.user.id}" of team "${teamID}"`)
    return res.status(403).send({ error: true, message: 'You must be on the team or be an admin to see temperature' })
  }

  debug(`attempt to Team temperature based on current user affects in team ${teamID}`)
  try {
    const temp = await DBTeam.getTeamAffectTemperature(teamID)
    if (temp.error) {
      return res.status(400).json(temp)
    }

    // if (!temp.find((curUser) => (req.user.id === curUser._id.toString()))) {
    //   return res.status(403).json({ error: true, message: 'You are not a member of that team' })
    // }
    // return res.json(temp)
    return res.json(temp[0].avgTemp)
  } catch (error) {
    console.error(`Failed to get team affect temperature in team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while getting team affect temperature' })
  }
})

// Expose the router for use in other files
export default router
