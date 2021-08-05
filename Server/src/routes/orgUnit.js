// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import * as DBUnit from '../mongo/unitController.js'

// for testing the database
import MongoDB from 'mongodb'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:org_unit_routes')

// Extract ObjectID for easy usage
const { ObjectID } = MongoDB

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************
// List all units in the database
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
    const userList = await DBUnit.listOrgUnits(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
    res.send(userList)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving org units', res, err, debug)
  }
})

// Update team data
router.post('/update', authenticateToken, async (req, res) => {
  // Attempt to retrieve user ID (and check token payload for id)
  const unitID = req.body.id || req.body._id
  if (!unitID) {
    return res.status(400).send({ error: true, message: 'Invalid or missing org unit ID' })
  }

  // Ensure this is an authorized update
  debug(`User "${req.user.id}" wants to update org unit "${unitID}" and they are a/an "${req.user.userType}" user`)
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'Admin accounts only' })
  }

  try {
    // Attempt to retrieve current user details
    const teamDetails = await DBUnit.getOrgUnitDetails(unitID)

    // Update values or fall-back to previous value
    const unitName = req.body.name || teamDetails.name

    // Update the team in the DB
    await DBUnit.updateOrgUnit(unitID, { name: unitName })
    return res.json({ success: true })
  } catch (err) {
    UTIL.checkAndReportError('Error updating org unit', res, err, debug)
  }
})

// 7. test unitController's createOrgUnit function: works!
router.post('/register', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { unitName, description, adminID } = req.body
  if (!unitName) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if adminID is a reasonable parameter for ObjectID (hexadecimal)
  if (adminID && !ObjectID.isValid(adminID)) {
    res.status(400).json({ invalid: true, message: 'adminID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // Attempt to create org
  debug(`Creating ${unitName}`)
  try {
    await DBUnit.createOrgUnit(unitName, description, adminID)
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to create ${unitName}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating the organization' })
  }
})

// 17. test teamController's getOrgUnitDetails (unitID)
router.get('/details/:unitID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const unitID = req.params.unitID
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if unitID is a reasonable parameter for ObjectID (hexadecimal)
  if (unitID && !ObjectID.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get org unit details
  debug(`attempting to list teams for user ${unitID}`)
  try {
    const unit = await DBUnit.getOrgUnitDetails(unitID)
    return res.json(unit)
  } catch (error) {
    debug(`Failed to get org unit details ${unitID}`)
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while getting org unit details' })
  }
})

// 9. test teamController's removeOrgUnit function
router.delete('/remove', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { unitID } = req.body
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if unitID is a reasonable parameter for ObjectID (hexadecimal)
  if (unitID && !ObjectID.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove org unit
  debug(`Removing Organizational Unit ${unitID}`)
  try {
    await DBUnit.removeOrgUnit(unitID)
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to remove Org Unit ${unitID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing Org Unit' })
  }
})

// Expose the router for use in other files
export default router
