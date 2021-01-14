import { retrieveDBHandle } from './connect.js'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

// Don't allow more than this many to be returned
const MAX_PER_PAGE = 250

// Function to escape special regex characters
function escapeRegExp (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

/**
 * List all documents in a collection with pagination, sorting, and filtering.
 * Aggregation pipeline is used.
 *
 * The query pipeline has the following form:
 *    1 (optional) lookup stages (intended for $lookup, only if lookup is not null)
 *    2 (optional) $match with filterBy and filter
 *    3 $facet to split into 'total' and 'data'
 *      - total branch with $count of filtered entries
 *      - data branch to sort and paginate:
 *        a) (optional) $sort with sortBy and sortOrder
 *        b) $skip using page and perPage
 *        c) $limit using perPage
 *        d) (optional) $project with the projection object (if not null)
 *
 * @param {string} collectionName Name of the collection in the database to query
 * @param {Object|Array(Object)} lookup Optional stage or array of stages to apply
 *                                      before filter (null skips this, default)
 * @param {object} projection Projection object to apply as a final stage (null skips projection, default)
 * @param {number} perPage Number of users per page (defaults to 25)
 * @param {number} page Page of results to skip to (defaults to 1)
 * @param {string} sortBy name of field to sort by (defaults to '')
 * @param {number} sortOrder Ascending (1) or descending (-1) sort (defaults to 1)
 * @param {string} filterBy name of field to filter on (defaults to '')
 * @param {string} filter String to search for when filtering (defaults to '')
 * @return {Promise} Resolves with facets { total, data } if successful, rejects on error
 */
export function listCollection (collectionName, lookup = null, projection = null,
  perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  return new Promise((resolve, reject) => {
    // Check max per-page
    if (perPage > MAX_PER_PAGE) {
      return reject(new Error('Cannot request more than 250 results'))
    }

    // Build the data pipeline with sorting and pagination
    const dataPipeline = []
    if (sortBy) {
      // Build proper sort query
      const query = {}
      query[sortBy] = sortOrder

      // Add to root pipeline as first stage
      const sortStage = { $sort: query }
      dataPipeline.push(sortStage)
    }

    // Pagination
    dataPipeline.push({ $skip: (page - 1) * perPage })
    dataPipeline.push({ $limit: perPage })

    // Optional projection stages
    if (projection) {
      dataPipeline.push({ $project: projection })
    }

    // Optional lookup and Filtering before splitting pipeline
    const rootPipeline = []
    if (lookup) {
      if (!Array.isArray(lookup)) { lookup = [lookup] }
      lookup.forEach((stage) => { rootPipeline.push(stage) })
    }

    if (filterBy && filter && filter.length >= 3) {
      // Build proper filter query
      const query = {}
      const regExStr = escapeRegExp(filter)
      query[filterBy] = new RegExp(`.*${regExStr}.*`, 'i')

      // Add to root pipeline as first stage
      const filterStage = { $match: query }
      rootPipeline.push(filterStage)
    }

    // Add faceting (splits the pipeline to 'total' and 'data')
    rootPipeline.push({
      $facet: {
        total: [{ $count: 'filteredCount' }],
        data: dataPipeline
      }
    })

    // Perform the full query
    const DBHandle = retrieveDBHandle('karunaData')
    DBHandle.collection(collectionName).aggregate(rootPipeline, (err, cursor) => {
      // Check for pipeline error
      if (err) {
        debug('List users failed')
        debug(err)
        return reject(err)
      }

      // Convert to array and return
      cursor.toArray((err, docs) => {
        if (err) {
          debug('Aggregation toArray failed')
          debug(err)
          return reject(err)
        }

        return resolve(docs[0])
      })
    })
  })
}
