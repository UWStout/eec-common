import { retrieveDBHandle } from './connect.js'

// To deal with ObjectIDs in the mongo format
import { ObjectID } from 'mongodb'

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
 * Retrieve the number of users in the user table
 * @return {Promise} Resolves to the number of users, rejects on error
 */
export function getUserCount () {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return DBHandle.collection('Users').estimatedDocumentCount()
}

/**
 * Retrieve all the details for a given userID
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return DBHandle
    .collection('Users')
    .findOne({ _id: new ObjectID(userID) }, { projection: { passwordHash: 0 } })
}

/**
 * Check if a user already exists for the given email
 * @param {string} email ID of the user in the database
 * @return {Promise} Resolves to the userID or -1 if no user exists
 */
export function emailExists (email) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Users')
      .findOne({ email: email }, { _id: 1 }, (err, result) => {
        // Check for an error
        if (err) {
          return resolve(-1)
        }
        // check if findOne failed
        if (result == null) {
          return resolve(-1)
        } else { return resolve(result) }
      })
  })
}

/**
 * List users in the database with pagination, sorting, and filtering
 * @param {bool} IDsOnly Include only IDs in the results
 * @param {number} perPage Number of users per page (defaults to 25)
 * @param {number} page Page of results to skip to (defaults to 1)
 * @param {string} sortBy name of field to sort by (defaults to '')
 * @param {number} sortOrder Ascending (1) or descending (-1) sort (defaults to 1)
 * @param {string} filterBy name of field to filter on (defaults to '')
 * @param {string} filter String to search for when filtering (defaults to '')
 * @return {Promise} Resolves with data if successful, rejects on error
 */
export function listUsers (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  const project = {}
  if (IDsOnly) { project._id = 1 }
  return new Promise((resolve, reject) => {
    // Check max per-page
    if (perPage > MAX_PER_PAGE) {
      return reject(new Error('Cannot request more than 250 results'))
    }

    // Possible filter query
    const query = {}
    if (filterBy && filter && filter.length >= 3) {
      const regExStr = escapeRegExp(filter)
      query[filterBy] = new RegExp(`.*${regExStr}.*`, 'i')
    }

    // Possible sort options
    const options = {}
    if (sortBy) {
      options.sort = {}
      options.sort[sortBy] = sortOrder
    }

    // Compute pagination values
    const skip = (page - 1) * perPage
    const limit = perPage

    // Issue query
    DBHandle.collection('Users')
      // Empty query gets all items, skip & limit pick a page, project will limit to just IDs
      .find(query, options).skip(skip).limit(limit).project(project)
      .toArray((err, userIDArray) => {
        // Something went wrong
        if (err) {
          debug('Failed to retrieve user list')
          debug(err)
          return reject(err)
        }

        // Return the array of IDs
        return resolve(userIDArray)
      })
  })
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the user document
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUser (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) { return reject(err) }
          resolve()
        }
      )
  })
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Users')
      .findOneAndDelete({ _id: new ObjectID(userID) })
      .then(result => { resolve() })
      .catch(error => {
        debug('Failed to remove user')
        debug(error)
        return reject(error)
      })
  })
}
