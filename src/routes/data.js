// Express router
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

import Debug from 'debug'
const debug = Debug('server:data')

// Create a router to attach to an express server app
const router = new Express.Router()

// list_items (authorized only)
router.get('/list_items', authenticateToken, (req, res) => {
  res.json([{ item: 1 }, { item: 2 }])
})

// list_items (authorized ADMIN only)
router.get('/list_secret_items', authenticateToken, (req, res) => {
  // Check if they are an admin
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({
      error: true, message: 'not authorized (admins only)'
    })
  }
  res.json([{ item: 3 }, { item: 4 }])
})

// Expose the router for use in other files
export default router
