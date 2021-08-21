// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import * as DBTeam from '../mongo/teamController.js'

// for testing the database
import MongoDB from 'mongodb'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:user_routes')

// Extract ObjectID for easy usage
const { ObjectID } = MongoDB

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
  debug(`User "${req.user.id}" wants to update team "${teamID}" and they are a/an "${req.user.userType}" user`)
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Admin accounts only' })
  }

  try {
    // Attempt to retrieve current user details
    const teamDetails = await DBTeam.getTeamDetails(teamID)

    // Update values or fall-back to previous value
    const name = req.body.name || teamDetails.name
    const description = req.body.description || teamDetails.description
    const orgId = (req.body.orgId === undefined ? teamDetails.orgId : req.body.orgId)

    // Update the team in the DB
    await DBTeam.updateTeam(teamID, { name, description, orgId })
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error updating team', res, err, debug)
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

  // check if unitID is a reasonable parameter for ObjectID (hexadecimal)
  if (unitID && !ObjectID.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (userID && !ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  /* // TO-DO? Check if team with the same team name is already registered?
  lookup = [{
    // Join with the matching 'orgId' in the 'Units' collection
    $lookup: {
      from: 'Units',
      let: { unitID: '$orgId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$unitID'] } } },
        { $project: { _id: 0, orgId: '$_id', unitName: '$name' } }
      ],
      as: 'unit'
    }
  }, {
    // Merge the fields of the Unit object into the root document
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          { $arrayElemAt: ['$unit', 0] },
          '$$ROOT'
        ]
      }
    }
  }]

  // Remove the unit object that was merged in
  project = { unit: 0 }
  */

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
router.post('/addUser', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { userID, teamID } = req.body
  if (!teamID || !userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (teamID && !ObjectID.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (userID && !ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // TO-DO: Check if already added to the team?

  // Attempt to add user to team
  debug(`adding ${userID} to ${teamID}`)
  try {
    await DBTeam.addToTeam(userID, teamID)
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to add ${userID} to team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while adding to team' })
  }
})

// 8. test teamController's removeTeam function: works!
router.delete('/remove/:teamID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (teamID && !ObjectID.isValid(teamID)) {
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

  if (unitID && !ObjectID.isValid(unitID)) {
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
// tested within update function at https://localhost:3000/data/team/update
// tested singularly here:
router.get('/details/:teamID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (teamID && !ObjectID.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (!ObjectID.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters', teamID })
    return
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
