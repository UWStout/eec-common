// Basic HTTP routing library
import Express from 'express'

// Utility functions
import * as UTIL from './utils.js'

// Database controller
import * as DBAffect from '../mongo/affectController.js'

// Authentication helpers
import { authenticateToken } from './auth.js'

// for testing the database
import MongoDB from 'mongodb'

// Allow interaction with the socket.io server
import { userStatusUpdated } from '../sockets/clientEngine.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:affect_routes')

// Extract ObjectId for easy usage
const { ObjectId } = MongoDB

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************

// 25. test affectController's function getAffectDetails (affectID)
router.get('/details/:affectID', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const affectID = req.params.affectID
  if (!affectID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (affectID && !ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get affect details
  debug(`attempting to get affect details ${affectID}`)
  try {
    const affect = await DBAffect.getAffectDetails(affectID)
    return res.json(affect)
  } catch (error) {
    debug(`Failed to get affect details ${affectID}`)
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while getting affect details' })
  }
})

// 26. test affectController's function createAffect (affectName, description, characterCodes, relatedIDs)
router.post('/create', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectName, description, characterCodes, relatedIDs } = req.body
  if (!affectName) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  if (relatedIDs.length !== 0) {
    for (let i = 0; i < relatedIDs.length; i++) {
      // check if affectID is a reasonable parameter for ObjectId
      if (!ObjectId.isValid(relatedIDs[i])) {
        res.status(400).json({ invalid: true, message: 'One of relatedIDs affectID was not a single String of 12 bytes or a string of 24 hex characters' })
      }
    }
  }

  // Attempt to create affect
  debug('attempting to create an affect')
  try {
    await DBAffect.createAffect(affectName, description, characterCodes, relatedIDs)
    return res.json({ success: true })
  } catch (error) {
    console.error('Failed to to create an affect')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while creating an affect' })
  }
})

// 27. test affectController's function removeAffect (affectID)
router.delete('/remove', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID } = req.body
  if (!affectID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (affectID && !ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove affect
  debug(`attempting to remove affect ${affectID}`)
  try {
    await DBAffect.removeAffect(affectID)
    // if user does not exist, function will succeed
    debug('success: affect removed!')
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to remove affect ${affectID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while attempting to remove affect' })
  }
})

// 28. test affectController's function updateAffect (affectID, newData)
router.post('/update', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID, newData } = req.body
  if (!affectID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (affectID && !ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // Attempt to create affect
  debug('attempting to update an affect')
  try {
    await DBAffect.updateAffect(affectID, newData)
    return res.json({ success: true })
  } catch (error) {
    console.error('Failed to to update an affect')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while updating an affect' })
  }
})

// 29. test affectController's function listAffects (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
router.get('/list', authenticateToken, async (req, res) => {
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
  try {
    const affectList = await DBAffect.listAffects(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
    return res.send(affectList)
  } catch (err) {
    UTIL.checkAndReportError('Error retrieving affect list', res, err, debug)
  }
})

// 30. test affectController's function insertAffectHistoryEntry (affectID, relatedID, isUser)
router.post('/insertHistory', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID, userID, teamID, isPrivate } = req.body
  if (!affectID || (!userID && !teamID)) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  } if (userID && teamID) {
    res.status(400).json({ invalid: true, message: 'Cannot submit both userID and teamID' })
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

  // check if relatedID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(relatedID)) {
    res.status(400).json({ invalid: true, id: relatedID, message: 'teamID or userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (affectID && !ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to insert affect history log')
  try {
    // updates history and user status
    await DBAffect.insertAffectHistoryEntry(affectID, relatedID, isUser, isPrivate)
    if (isUser) {
      userStatusUpdated(relatedID) // runs async, but no need to await
    }
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to insert affect history log')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while inserting affect history log' })
  }
})

// 31. test affectController's function listAffectHistory (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
router.get('/listHistory/userID/:userID?/affectLogID/:affectLogID?/dateStart/:dateStart?/dateEnd/:dateEnd?', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const userID = req.params.userID
  const affectLogID = req.params.affectLogID
  const dateStart = req.params.dateStart
  const dateEnd = req.params.dateEnd

  debug(affectLogID)

  // check if affectLogID is a reasonable parameter for ObjectId
  if (affectLogID && !ObjectId.isValid(affectLogID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // check if userID is a reasonable parameter for ObjectId
  if (userID && !ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // TO-DO: check if date is valid

  // attempt to get affect details
  debug('attempting to list affect history')
  try {
    const affectLog = await DBAffect.listAffectHistory(userID, affectLogID, dateStart, dateEnd)
    return res.json(affectLog)
  } catch (error) {
    debug('Failed to list affect history')
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while listing affect history' })
  }
})

// 32. test affectController's function removeAffectHistoryEntry (affectLogID)
router.delete('/removeHistory', authenticateToken, async (req, res) => {
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

  // check if affectLogID is a reasonable parameter for ObjectId
  if (affectLogID && !ObjectId.isValid(affectLogID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to remove affect log
  debug(`attempting to remove affect log ${affectLogID}`)
  try {
    await DBAffect.removeAffectHistoryEntry(affectLogID, dateRange)
    // if user does not exist, function will succeed
    debug('success: affect log removed!')
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to remove affect log ${affectLogID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while attempting to remove affect log' })
  }
})

router.post('/setFavoriteAffect', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID, userID } = req.body
  if (!affectID || !userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if userID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, id: userID, message: 'userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to update user\'s favorite affects')
  try {
    // updates history and user status
    await DBAffect.setFavoriteAffect(affectID, userID)
    debug('user favorite affects updated')
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to add affect to user\'s favorites')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Failed to add affect to user\'s favorites' })
  }
})

router.post('/removeFavoriteAffect', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID, userID } = req.body
  if (!affectID || !userID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if userID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, id: userID, message: 'userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to delete user\'s favorite affects')
  try {
    // updates history and user status
    await DBAffect.removeFavoriteAffect(userID, affectID)
    debug('attempting to delete user favorite affects')
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to remove affect to user\'s favorites')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Failed to remove affect to user\'s favorites' })
  }
})

router.get('/listFavoriteAffects/:userID?', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const userID = req.params.userID

  // check if userID is a reasonable parameter for ObjectId
  if (userID && !ObjectId.isValid(userID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get affect details
  debug('attempting to list favorite affects')
  try {
    const favoriteAffects = await DBAffect.listFavoriteAffects(userID)
    return res.json(favoriteAffects || [])
  } catch (error) {
    debug('Failed to list favorite affects')
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while listing favorite affects' })
  }
})

router.post('/setTeamDisabledAffect', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID, teamID } = req.body
  if (!affectID || !teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, id: teamID, message: 'teamID must be a 12 byte number or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to update team\'s disabled affects')
  try {
    // updates history and user status
    await DBAffect.setTeamDisabledAffect(affectID, teamID)
    debug('team\'s disabled affects updated')
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to add affect to teams\'s disabled list')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Failed to add affect to team\'s disabled affects' })
  }
})

router.post('/removeTeamDisabledAffect', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const { affectID, teamID } = req.body
  if (!affectID || !teamID) {
    res.status(400).json({ invalid: true, message: 'Missing required information' })
    return
  }

  // check if teamID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, id: teamID, message: 'teamID must be a 12 byte number or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectId
  if (!ObjectId.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to delete team\'s disabled affects')
  try {
    // updates history and user status
    await DBAffect.removeTeamDisabledAffect(teamID, affectID)
    debug('attempting to delete team\'s disabled affects')
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to remove affect from team\'s disabled affects')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Failed to remove affect to team\'s disabled affects' })
  }
})

router.get('/listTeamDisabledAffects/:teamID?', authenticateToken, async (req, res) => {
  // Extract and check required fields
  const teamID = req.params.teamID

  // check if teamID is a reasonable parameter for ObjectId
  if (teamID && !ObjectId.isValid(teamID)) {
    res.status(400).json({ invalid: true, message: 'affectLogID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get affect details
  debug('attempting to list disabled affects')
  try {
    const disabledAffects = await DBAffect.listTeamDisabledAffects(teamID)
    return res.json(disabledAffects || [])
  } catch (error) {
    debug('Failed to list disabled affects')
    debug(error)
    return res.status(500).json({ error: true, message: 'Error while listing disabled affects' })
  }
})

export default router
