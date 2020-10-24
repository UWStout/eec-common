import Express from 'express'

// Create a router to attach to an express server app
const router = new Express.Router()

// API routes
router.get('/verify', (req, res) => {
  res.json({ error: 'not implemented' })
})

// Expose the router for use in other files
export default router
