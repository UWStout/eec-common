// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import { getDBTeamController } from './dbSelector.js'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:user')

// Get database auth and user controller objects
const DBTeam = getDBTeamController()

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
    const teamName = req.body.name || teamDetails.name

    // Accept null, so only undefined will fallback to previous value
    const orgId = (req.body.orgId === undefined ? teamDetails.orgId : req.body.orgId)

    // Update the team in the DB
    await DBTeam.updateTeam(teamID, { name: teamName, orgId })
    res.send({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error updating team', res, err, debug)
  }
})

// Expose the router for use in other files
export default router
