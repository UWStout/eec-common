/*
tests database functions within userController, teamController, and authController
*/

// Basic HTTP routing library
import Express from 'express'

// Authorization token library
import JWT from 'jsonwebtoken'

// Utility functions
import * as UTIL from './utils.js'

// Database controller
import { getDBAffectController, getDBAffectHistoryController, getDBAuthController, getDBLogController, getDBTeamController, getDBUnitController, getDBUserController } from './dbSelector.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:auth')

// Get database controllers
const authDB = getDBAuthController()
const teamDB = getDBTeamController()
const userDB = getDBUserController()
const unitDB = getDBUnitController()
const logDB = getDBLogController()
const affectDB = getDBAffectController()
const affectHistoryDB = getDBAffectHistoryController()

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

// 1. tests authController validateUser (email, password) function
// also tested in auth.js with https://localhost:3000/auth/login

// 2. test userController emailExists and
// 3. test authController function createUser (firstName, lastName, email, userType, password)
// also tested in auth.js with https://localhost:3000/auth/register

// 4. test teamController listTeams
// also tested within team.js with https://localhost:3000/data/team/list

// 5. test teamController createTeam
router.post('/registerTeam', async (req, res) => {
  // Extract and check required fields
  const { teamName, unitID, userID } = req.body
  if (!teamName) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
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

// 6. test teamController's addToTeam function: works!
router.post('/addToTeam', async (req, res) => {
  // Extract and check required fields
  const { userID, teamID } = req.body
  if (!teamID || !userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // TO-DO: Check if already added to the team?

  // Attempt to add user to team
  debug(`adding ${userID} to ${teamID}`)
  try {
    const team = await teamDB.addToTeam(userID, teamID)
    return res.status(200).json({ message: 'success', teamID: team })
  } catch (error) {
    console.error(`Failed to add ${userID} to team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while adding to team' })
  }
})

// 7. test teamController's createOrgUnit function: works!
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
    const teamID = await unitDB.createOrgUnit(unitName, description, adminID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error(`Failed to create ${unitName}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating the organization' })
  }
})

// 8. test teamController's removeTeam function: works!
router.delete('/removeTeam', async (req, res) => {
  // Extract and check required fields
  const { teamID } = req.body
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to remove team
  debug(`Removing Team ${teamID}`)
  try {
    const team = await teamDB.removeTeam(teamID)
    return res.status(200).json({ message: 'success', teamID: team })
  } catch (error) {
    console.error(`Failed to remove Team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while removing Team' })
  }
})

// 9. test teamController's removeOrgUnit function
router.delete('/removeOrg', async (req, res) => {
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
/*
// 10. test teamController's listTeamsInUnit (unitID, page = 1, perPage = 25) function
router.get('/listTeamsInUnit/:unitID', async (req, res) => {
  // Extract and check required fields
  const unitID = req.params.unitID
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }
  // Try to get the pagination query string values
  const [perPage, page] = UTIL.getPaginationValues(req.query)
  if (isNaN(perPage) || isNaN(page)) {
    return res.status(400).send({ error: true, message: 'Invalid parameter' })
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
*/

/*
// 11. test teamController's listTeamsForUser (userID, page = 1, perPage = 25) function
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
*/

// 12. test userController's list user function with listUsers(req.query.fullInfo === undefined, perPage, page)
// done within user.js at https://localhost:3000/data/user/list?fullInfo=true&perPage=10&page=0

// 13. test userController's update user function with updateUser(userID, { firstName, lastName, teams, meta: userMeta })
// done within user.js at https://localhost:3000/data/user/update/

// 14. test userController's promote user function with updateUser(userID, { userType: 'admin' })
// done within user.js at https://localhost:3000/data/user/promote/

// 15. test userController's getUserDetails(userID) function
// done within user.js at https://localhost:3000/data/user/5ff742f09bb9905f98eb348e

// 16. test userController's removeUser (userID) function
router.delete('/removeUser', async (req, res) => {
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

// 17. test teamController's getOrgUnitDetails (unitID)
router.get('/getOrgUnitDetails/:unitID', async (req, res) => {
  // Extract and check required fields
  const unitID = req.params.unitID
  if (!unitID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to get org unit details
  debug(`attempting to list teams for user ${unitID}`)
  try {
    const unit = await unitDB.getOrgUnitDetails(unitID)
    return res.status(200).json({ message: 'success', unit: unit })
  } catch (error) {
    debug(`Failed to get org unit details ${unitID}`)
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while getting org unit details' })
  }
})
// 18. test teamControllers getTeamDetails (teamID)
// tested within update function at https://localhost:3000/data/team/update
// tested singularly here:
router.get('/getTeamDetails/:teamID', async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID
  if (!teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // attempt to get team details
  debug(`attempting to get team details ${teamID}`)
  try {
    const team = await teamDB.getTeamDetails(teamID)
    return res.status(200).json({ message: 'success', team: team })
  } catch (error) {
    debug(`Failed to get team details ${teamID}`)
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while getting team details' })
  }
})
// 19. test teamControllers updateTeam (userID, newData)
// tested within https://localhost:3000/data/team/update

// 20. test logController's logWizardMessage (message, correspondentID)
router.post('/logWizardMessage', async (req, res) => {
  // Extract and check required fields
  const { message, correspondentID } = req.body
  if (!message) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Attempt to create org
  debug('logging wizard message')
  try {
    const teamID = await logDB.logWizardMessage(message, correspondentID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error('Failed to log wizard message')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while logging wizard message' })
  }
})

// 21. test logController's logUserMessage (message, correspondentID, userID): TO-DO: BROKEN
router.post('/logUserMessage', async (req, res) => {
  // Extract and check required fields
  const { message, correspondentID, userID } = req.body
  if (!message || !userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // Attempt to create org
  debug('logging user message')
  try {
    const teamID = await logDB.logUserMessage(message, correspondentID, userID)
    return res.status(200).json({ message: 'success', teamID: teamID })
  } catch (error) {
    console.error('Failed to log user message')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while logging user message' })
  }
})

// 22. test userController's function getUserCount ()
router.get('/getUserCount', async (req, res) => {
  // Attempt to create org
  debug('getting User Count')
  try {
    const userCount = await userDB.getUserCount()
    return res.status(200).json({ message: 'success', userCount: userCount })
  } catch (error) {
    console.error('Failed to get User Count')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while getting user count' })
  }
})

// 23. test unitController's function updateOrgUnits (userID, newData)
// tested in orgUnit.js under endpoint 'data/unit/update'

// 24. test unitController's listOrgUnits (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
// tested in orgUnit.js under endpoint 'data/unit/list'

// Expose the router for use in other files
export default router
