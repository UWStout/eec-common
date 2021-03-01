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
const logDB = DBSelector.getDBLogController()

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************

// 20. test logController's logWizardMessage (message, correspondentID)
router.post('/logWizardMessage', authenticateToken, async (req, res) => {
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
router.post('/logUserMessage', authenticateToken, async (req, res) => {
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
