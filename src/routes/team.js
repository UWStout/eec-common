// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Database controller
import { getDBTeamController } from './dbSelector.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:user')

// Get database auth and user controller objects
const DBTeam = getDBTeamController()

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************
// List all teamIDs in the database
router.get('/list', authenticateToken, async (req, res) => {
  // Admin users only
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'not authorized' })
  }

  // Attempt to retrieve user list
  try {
    const teamList = DBTeam.getTeamList(req.query.perPage, req.query.page)
    req.res(teamList)
  } catch (err) {
    debug('Error retrieving team list')
    debug(err)
    req.status(500).res({ error: true, message: 'error retrieving team list' })
  }
})

// Expose the router for use in other files
export default router
