import Express from 'express'

// Create a router to attach to an express server app
const router = new Express.Router()

// Various api routes
router.get('/list_items', (req, res) => {
  res.json([{ item: 1 }, { item: 2 }])
})

// Expose the router for use in other files
export default router
