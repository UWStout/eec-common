// Basic HTTP routing library
import Express from 'express'

// Database controller
import * as DBLog from '../mongo/logController.js'

// Authentication helpers
import { authenticateToken } from './auth.js'

// for testing the database
import MongoDB from 'mongodb'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:log_routes')

// Extract ObjectID for easy usage
const { ObjectID } = MongoDB

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************

// 20. test logController's logWizardMessage (message, correspondentID)
router.post('/wizardMessage', authenticateToken, async (req, res) => {
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
    await DBLog.logWizardMessage(message, correspondentID)
    return res.json({ success: true })
  } catch (error) {
    console.error('Failed to log wizard message')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while logging wizard message' })
  }
})

// 21. test logController's logUserMessage (message, correspondentID, userID): TO-DO: BROKEN
router.post('/userMessage', authenticateToken, async (req, res) => {
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
    await DBLog.logUserMessage(message, correspondentID, userID)
    return res.json({ success: true })
  } catch (error) {
    console.error('Failed to log user message')
    console.error(error)
    return res.status(500).json({ error: true, message: 'Error while logging user message' })
  }
})

export default router
