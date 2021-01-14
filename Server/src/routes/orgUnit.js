// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import { getDBUnitController } from './dbSelector.js'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:org_unit')

// Get database auth and user controller objects
const DBUnit = getDBUnitController()

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
    const userList = await DBUnit.listOrgUnits(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
    res.send(userList)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving org units', res, err, debug)
  }
})

// Expose the router for use in other files
export default router
