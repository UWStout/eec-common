/*
tests database functions within userController, teamController, and authController
*/

// Basic HTTP routing library
import Express from 'express'

// Authorization token library (not currently in use)
// import JWT from 'jsonwebtoken'

// Utility functions
import * as UTIL from './utils.js'

// Database controller
import * as DBSelector from './dbSelector.js'

// Authentication helpers (not currently in use)
// import { authenticateToken, decodeToken } from './auth.js'

// Create debug output object
import Debug from 'debug'

// for using the database
import { ObjectID } from 'mongodb'

const debug = Debug('server:test')

// Get database controllers
// const authDB = getDBAuthController() // (not currently in use)
const teamDB = DBSelector.getDBTeamController()
const userDB = DBSelector.getDBUserController()
const unitDB = DBSelector.getDBUnitController()
const logDB = DBSelector.getDBLogController()
const affectDB = DBSelector.getDBAffectController()

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

  // check if adminID is a reasonable parameter for ObjectID (hexadecimal)
  if (adminID && !ObjectID.isValid(adminID)) {
    res.status(400).json({ invalid: true, message: 'adminID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (teamID && !ObjectID.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if unitID is a reasonable parameter for ObjectID (hexadecimal)
  if (unitID && !ObjectID.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
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

// 10. test teamController's listTeamsInUnit (unitID) function
router.get('/listTeamsInUnit/:unitID', async (req, res) => {
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
    const teams = await teamDB.listTeamsInUnit(unitID)
    return res.status(200).json({ message: 'success', teams })
  } catch (error) {
    console.error(`Failed to list teams in org unit ${unitID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while listing teams in org unit' })
  }
})

// 11. test teamController's listUsersInTeam (teamID) function
router.get('/listUsersInTeam/:teamID', async (req, res) => {
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

  // attempt to list users in the given team
  debug(`attempt to list users in Team ${teamID}`)
  try {
    const users = await userDB.listUsersInTeam(teamID)
    if (users.error) {
      return res.status(400).json(users)
    }
    return res.status(200).json({ message: 'success', users })
  } catch (error) {
    console.error(`Failed to list users in team ${teamID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while listing users in team' })
  }
})

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

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (userID && !ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if unitID is a reasonable parameter for ObjectID (hexadecimal)
  if (unitID && !ObjectID.isValid(unitID)) {
    res.status(400).json({ invalid: true, message: 'unitID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if teamID is a reasonable parameter for ObjectID (hexadecimal)
  if (teamID && !ObjectID.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'teamID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (correspondentID && !ObjectID.isValid(correspondentID)) {
    res.status(400).json({ invalid: true, message: 'correspondentID must be a single String of 12 bytes or a string of 24 hex characters' })
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

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (correspondentID && !ObjectID.isValid(correspondentID)) {
    res.status(400).json({ invalid: true, message: 'correspondentID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // check if userID is a reasonable parameter for ObjectID (hexadecimal)
  if (userID && !ObjectID.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'userID must be a single String of 12 bytes or a string of 24 hex characters' })
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

// 24. test unitController's function listOrgUnits (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
// tested in orgUnit.js under endpoint 'data/unit/list'

// 25. test affectController's function getAffectDetails (affectID)
router.get('/getAffectDetails/:affectID', async (req, res) => {
  // Extract and check required fields
  const affectID = req.params.affectID
  if (!affectID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get affect details
  debug(`attempting to get affect details ${affectID}`)
  try {
    const affect = await affectDB.getAffectDetails(affectID)
    return res.status(200).json({ message: 'success', affect: affect })
  } catch (error) {
    debug(`Failed to get affect details ${affectID}`)
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while getting affect details' })
  }
})

// 26. test affectController's function createAffect (affectName, description, characterCodes, relatedIDs)
router.post('/createAffect', async (req, res) => {
  // Extract and check required fields
  const { affectName, description, characterCodes, relatedIDs } = req.body
  if (!affectName) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  if (relatedIDs.length !== 0) {
    for (let i = 0; i < relatedIDs.length; i++) {
      // check if affectID is a reasonable parameter for ObjectID
      if (!ObjectID.isValid(relatedIDs[i])) {
        res.status(400).json({ invalid: true, message: 'One of relatedIDs affectID was not a single String of 12 bytes or a string of 24 hex characters' })
      }
    }
  }

  // Attempt to create affect
  debug('attempting to create an affect')
  try {
    const affect = await affectDB.createAffect(affectName, description, characterCodes, relatedIDs)
    return res.status(200).json({ message: 'success', affect: affect, characterCodes })
  } catch (error) {
    console.error('Failed to to create an affect')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating an affect' })
  }
})

// 27. test affectController's function removeAffect (affectID)
router.delete('/removeAffect', async (req, res) => {
  // Extract and check required fields
  const { affectID } = req.body
  if (!affectID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove affect
  debug(`attempting to remove affect ${affectID}`)
  try {
    const affect = await affectDB.removeAffect(affectID)
    // if user does not exist, function will succeed
    debug('success: affect removed!')
    return res.status(200).json({ message: 'success', affect: affect })
  } catch (error) {
    console.error(`Failed to remove affect ${affectID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while attempting to remove affect' })
  }
})

// 28. test affectController's function updateAffect (affectID, newData)
router.post('/updateAffect', async (req, res) => {
  // Extract and check required fields
  const { affectID, newData } = req.body
  if (!affectID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // Attempt to create affect
  debug('attempting to update an affect')
  try {
    const affect = await affectDB.updateAffect(affectID, newData)
    return res.status(200).json({ message: 'success', affect: affect })
  } catch (error) {
    console.error('Failed to to update an affect')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while updating an affect' })
  }
})

// 29. test affectController's function listAffects (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
router.get('/listAffects', async (req, res) => {
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

  // Attempt to retrieve affect list
  const IDsOnly = (req.query.fullInfo === undefined)
  // const IDsOnly = false
  try {
    const affectList = await affectDB.listAffects(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
    res.send(affectList)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving affect list', res, err, debug)
  }
})

// 30. test affectController's function insertAffectHistoryEntry (affectID, relatedID, isUser)
router.post('/insertAffectHistoryEntry', async (req, res) => {
  // Extract and check required fields
  const { affectID, userID, teamID } = req.body
  if (!affectID || (!userID && !teamID)) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  } if (userID && teamID) {
    res.status(400).json({ invalid: true, message: 'cannot submit both userID and teamID' })
    return
  }

  // set relatedID
  let relatedID, isUser
  if (userID) {
    relatedID = userID
    isUser = true
  } else {
    relatedID = teamID
    isUser = false
  }

  // check if relatedID is a reasonable parameter for ObjectID
  if (!ObjectID.isValid(relatedID)) {
    res.status(400).json({ invalid: true, id: relatedID, message: 'teamID or userID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to insert affect history log')
  try {
    const log = await affectDB.insertAffectHistoryEntry(affectID, relatedID, isUser)
    return res.status(200).json({ message: 'success', affectLog: log })
  } catch (error) {
    console.error('Failed to insert affect history log')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while inserting affect history log' })
  }
})

// 31. test affectController's function listAffectHistory (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
// TO-DO: make this a function to retrieve affect history with support to filter by date range and user/team ID
router.get('/listAffectHistory/affectLogID/:affectLogID?/dateRange/:dateStart?/:dateEnd?', async (req, res) => {
  // Extract and check required fields
  const affectLogID = req.params.affectLogID
  const dateStart = req.params.dateStart
  const dateEnd = req.params.dateEnd

  debug(affectLogID)


  // check if affectLogID is a reasonable parameter for ObjectID
  if (affectLogID && !ObjectID.isValid(affectLogID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  
  // TO-DO: check if date is valid

  // attempt to get affect details
  debug('attempting to list affect history')
  try {
    const affect = await affectDB.listAffectHistory(affectLogID, [dateStart, dateEnd])
    return res.status(200).json({ message: 'success', affect: affect })
  } catch (error) {
    debug('Failed to list affect history')
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while listing affect history' })
  }
})

// 32. test affectController's function removeAffectHistoryEntry (affectLogID)
router.delete('/removeAffectHistoryEntry', async (req, res) => {
  // Extract and check required fields
  const { affectLogID, dateRange } = req.body
  if (!affectLogID && !dateRange) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  if (affectLogID && dateRange) {
    res.status(400).json({ invalid: true, message: 'cannot submit both affectLogID and dateRange' })
    return
  }

  // TO-DO: check if date is valid

  // check if affectLogID is a reasonable parameter for ObjectID
  if (affectLogID && !ObjectID.isValid(affectLogID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove affect log
  debug(`attempting to remove affect log ${affectLogID}`)
  try {
    const affectLog = await affectDB.removeAffectHistoryEntry(affectLogID, dateRange)
    // if user does not exist, function will succeed
    debug('success: affect log removed!')
    return res.status(200).json({ message: 'success', affectLog: affectLog })
  } catch (error) {
    console.error(`Failed to remove affect log ${affectLogID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while attempting to remove affect log' })
  }
})

// Expose the router for use in other files
export default router
