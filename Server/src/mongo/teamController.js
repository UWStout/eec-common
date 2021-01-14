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
      .then(() => { resolve(true) })
      .catch(() => { resolve(false) })
  })
}

/**
 * Update a team entry in the database with new data
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the team document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateTeam (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    // Make sure foreign key is the proper ObjectID type (if its defined)
    if (newData.orgId && (typeof newData.orgId !== 'object' || !(newData.orgId instanceof 'ObjectID'))) {
      newData.orgId = new ObjectID(newData.orgId)
    }

    DBHandle.collection('Teams')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update team')
            debug(err)
            return reject(err)
          }
          resolve()
        }
      )
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
    // Build lookup pipeline
    lookup = [{
      // Join with the matching 'orgId' in the 'Units' collection
      $lookup: {
        from: 'Units',
        let: { unitID: '$orgId' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$unitID'] } } },
          { $project: { _id: 0, orgId: '$_id', unitName: '$name' } }
        ],
        as: 'unit'
      }
    }, {
      // Merge the fields of the Unit object into the root document
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            { $arrayElemAt: ['$unit', 0] },
            '$$ROOT'
          ]
        }
      }
    }]

    // Remove the unit object that was merged in
    project = { unit: 0 }
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
        { $push: { teams: new ObjectID(teamID) } }
      ).then(() => { return resolve('true') })
      .catch((err) => { return reject(err) })
  })
}
