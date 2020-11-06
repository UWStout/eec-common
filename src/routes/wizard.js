// Express router and path lib
import Express from 'express'
import path from 'path'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Path to raw view files
const VIEW_PATH = './views/wizard'

// Create a router to attach to an express server app
const router = new Express.Router()

// Account login or registration (no auth required)
router.get(['/register.html', '/login.html', '/accounts.css', '/login.js', '/register.js', '/Karuna.png'], (req, res) => {
  // Attempt to send file in response
  res.sendFile(req.path, { root: path.resolve(VIEW_PATH) })
})

// The wizard manual talk-back interface (authorized only)
router.get('/', authenticateToken, (req, res) => {
  // Check if they are an admin
  if (!req.user || req.user.type !== 'admin') {
    // Send to login
    return res.sendFile('login.html', { root: path.join(VIEW_PATH) })
  }

  // Send to interface
  return res.sendFile('emeraldCity.html', { root: path.join(VIEW_PATH) })
})

export default router
