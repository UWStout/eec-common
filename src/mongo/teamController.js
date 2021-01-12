import { retrieveDBHandle } from './connect.js'

// for using the database
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
 * Retrieve details for the given team
 * @param {number} teamID ID of the team to lookup
 * @return {Promise} Resolves to JS Object with all the team details, rejects on error
 */
export function getTeamDetails (teamID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Teams')
    .findOne({ _id: new ObjectID(teamID) })
}

/**
 * Retrieve details for the given organizational unit
 * @param {number} unitID ID of the org unit to lookup
 * @return {Promise} Resolves to JS Object with all the org unit details, rejects on error
 */
export function getOrgUnitDetails (unitID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Units')
    .findOne({ _id: new ObjectID(unitID) })
}

/**
 * Create new team and optionally add user to the team.
 * @param {string} teamName Name for the new team
 * @param {number} unitID ID of the related unit (may be empty)
 * @param {number} userID ID of a user to add to the team (may be empty)
 * @return {number} ID of the newly created team or null if creation fails
 */
export function createTeam (teamName, unitID, userID) {
  const DBHandle = retrieveDBHandle('karunaData')

  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Teams')
      .insertOne({ teamName, unitID: new ObjectID(unitID) }, (err, result) => {
        if (err) {
          debug('Failed to create team')
          debug(err)
          return reject(err)
        } else {
          if (userID) { addToTeam(userID) }
          return resolve(result)
        }
      })
  })
}

/**
 * Create new organization unit (teams are housed under units)
 * @param {string} unitName Name for the new org unit
 * @param {string} description Description of the org unit (may be null)
 * @param {string} adminID ID of admin user (may be null)
 * @return {Promise} Resolves to ID of the newly created org unit, rejects if creation fails
 */
export function createOrgUnit (unitName, description, adminID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Units')
    .insertOne({ unitName, description, adminID: new ObjectID(adminID) })
}

/**
 * Drop the given team from the database
 * @param {number} teamID ID of the team to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeTeam (teamID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Teams')
      .findOneAndDelete({ _id: new ObjectID(teamID) })
      .then(result => { resolve(true) })
      .catch(() => { resolve(false) })
  })
}

/**
 * Drop the given organization unit from the database
 * @param {number} unitID ID of the org unit to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeOrgUnit (unitID) {
  // TODO: Do something with all teams in that org unit
  // What could we do?
  // - Only remove an org if all teams are already deleted
  // - Set the 'unitID' to null in all teams of that unit
  // - Automatically delete all teams in the unit

  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Units')
      .findOneAndDelete({ _id: new ObjectID(unitID) })
      .then(result => { resolve(true) })
      .catch(() => { resolve(false) })
  })
}

/**
 * List teams in the database with pagination, sorting, and filtering
 * @param {bool} IDsOnly Include only IDs in the results
 * @param {number} perPage Number of users per page (defaults to 25)
 * @param {number} page Page of results to skip to (defaults to 1)
 * @param {string} sortBy name of field to sort by (defaults to '')
 * @param {number} sortOrder Ascending (1) or descending (-1) sort (defaults to 1)
 * @param {string} filterBy name of field to filter on (defaults to '')
 * @param {string} filter String to search for when filtering (defaults to '')
 * @return {Promise} Resolves with data if successful, rejects on error
 */
export function listTeams (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
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
    DBHandle.collection('Teams')
      // Empty query gets all items, skip & limit pick a page, project will limit to just IDs
      .find(query, options).skip(skip).limit(limit).project(project)
      .toArray((err, resultsArray) => {
        // Something went wrong
        if (err) {
          debug('Failed to retrieve user list')
          debug(err)
          return reject(err)
        }

        // Return the array of results
        return resolve(resultsArray)
      })
  })
}

/**
 * Add a user to a given team
 * @param {number} userID The id of the user to add
 * @param {number} teamID The id of the team to add them too
 * @return {Promise} Resolves with 'true' on success, rejects on error
 */
export function addToTeam (userID, teamID) {
  return new Promise((resolve, reject) => {
    // Get database handle
    const DBHandle = retrieveDBHandle('karunaData')

    // Update user record to include indicated team
    DBHandle.collection('Users')
      .update(
        { _id: new ObjectID(userID) },
        { $push: { $teams: new ObjectID(teamID) } }
      ).then((result) => { return resolve(result) })
      .catch((err) => { return reject(err) })
  })
}
