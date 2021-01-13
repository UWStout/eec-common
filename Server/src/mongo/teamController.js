import { retrieveDBHandle } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

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
  let insertThis

  if (!unitID) {
    insertThis = { teamName }
  } else insertThis = { teamName, unitID: new ObjectID(unitID) }

  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Teams')
      .insertOne(insertThis, (err, result) => {
        if (err) {
          debug('Failed to create team')
          debug(err)
          return reject(err)
        } else {
          if (userID) {
            debug('adding ' + userID + ' to team')
            addToTeam(userID)
          }
          debug('Creating team')
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
  let insertThis
  if (!adminID && !description) {
    insertThis = { unitName }
  } else if (!adminID) {
    insertThis = { unitName, description }
  } else insertThis = { unitName, description, adminID: new ObjectID(adminID) }
  return DBHandle
    .collection('Units')
    .insertOne(insertThis)
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
 * List users in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
 *
 * @param {bool} IDsOnly Include only IDs in the results
 */
export function listTeams (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  // Build projection object if needed
  let project = null
  let lookup = null
  if (IDsOnly) {
    project = { _id: 1 }
  } else {
    // Build lookup object to merge 'unit' into results
    lookup = {
      $lookup: {
        from: 'Units',
        localField: 'orgId',
        foreignField: '_id',
        as: 'unit'
      }
    }

    // Project out the orgID
    project = { orgId: 0 }
  }

  // Execute collection list query
  return listCollection('Teams', lookup, project, perPage, page, sortBy, sortOrder, filterBy, filter)
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
