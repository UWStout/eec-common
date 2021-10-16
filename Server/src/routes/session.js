// Basic HTTP routing library
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Utility functions
import * as UTIL from './utils.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('karuna:server:session_routes')

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************
// List all sessions in the database
router.get('/list', authenticateToken, async (req, res) => {
  // Admin users only
  if (req.user.userType !== 'admin') {
    return res.status(403).send({ error: true, message: 'not authorized' })
  }

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
  // if (req.query.fullInfo === false || req.query.fullInfo === 'false') {
  //   req.query.fullInfo = undefined
  // }
  // const IDsOnly = (req.query.fullInfo === undefined)

  req.sessionStore.all((err, sessions) => {
    // Catch errors
    if (err) {
      return UTIL.checkAndReportError('Error retrieving sessions', res, err, debug)
    }

    // Paginate
    const start = (page - 1) * perPage
    let pageData = sessions.slice(start, start + perPage)

    // Filter
    if (filterBy && filter) {
      const lowerFilter = filter.toLowerCase()
      pageData = pageData.filter((item) =>
        (item[filterBy].toLowerCase().contains(lowerFilter))
      )
    }

    // Sort
    if (sortBy) {
      pageData.sort((a, b) => {
        if (sortOrder >= 0) {
          return a[sortBy].localeCompare(b[sortBy])
        } else {
          return b[sortBy].localeCompare(a[sortBy])
        }
      })
    }

    // Send the result
    return res.send(pageData)
  })
})

// Expose the router for use in other files
export default router
