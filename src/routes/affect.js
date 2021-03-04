// Basic HTTP routing library
import Express from 'express'

// Authorization token library (not currently in use)
// import JWT from 'jsonwebtoken'

// Utility functions
import * as UTIL from './utils.js'

// Database controller
import * as DBSelector from './dbSelector.js'

// Authentication helpers (not currently in use)
import { authenticateToken, decodeToken } from './auth.js'

// Create debug output object
import Debug from 'debug'

// for testing the database
import { ObjectID } from 'mongodb'

const debug = Debug('server:test')

// Get database controllers
const affectDB = DBSelector.getDBAffectController()

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

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // attempt to get affect details
  debug(`attempting to get affect details ${affectID}`)
  try {
    const affect = await affectDB.getAffectDetails(affectID)
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

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a single String of 12 bytes or a string of 24 hex characters' })
  }

  // Attempt to create affect
  debug('attempting to update an affect')
  try {
    const affect = await affectDB.updateAffect(affectID, newData)
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
    const affectList = await affectDB.listAffects(IDsOnly, perPage, page, sortBy, sortOrder, filterBy, filter)
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

  // check if relatedID is a reasonable parameter for ObjectID
  if (!ObjectID.isValid(relatedID)) {
    res.status(400).json({ invalid: true, id: relatedID, message: 'teamID or userID must be a 12 byte number or a string of 24 hex characters' })
  }

  // check if affectID is a reasonable parameter for ObjectID
  if (affectID && !ObjectID.isValid(affectID)) {
    res.status(400).json({ invalid: true, message: 'affectID must be a be a 12 byte number or a string of 24 hex characters' })
  }

  // Attempt to insert affect history log
  debug('attempting to insert affect history log')
  try {
    await affectDB.insertAffectHistoryEntry(affectID, relatedID, isUser, isPrivate)
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to insert affect history log')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while inserting affect history log' })
  }
})

// 31. test affectController's function listAffectHistory (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
router.get('/listHistory/affectLogID/:affectLogID?/dateStart/:dateStart?/dateEnd/:dateEnd?', authenticateToken, async (req, res) => {
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
    const affectLog = await affectDB.listAffectHistory(affectLogID, dateStart, dateEnd)
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
    return res.json({ success: true })
  } catch (error) {
    console.error(`Failed to remove affect log ${affectLogID}`)
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while attempting to remove affect log' })
  }
})

export default router
