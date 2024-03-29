// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// for using the database
import MongoDB from 'mongodb'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

// Extract ObjectId for easy usage
const { ObjectId } = MongoDB

const debug = Debug('karuna:mongo:teamController')

/**
 * Retrieve details for the given team
 *
 * tested in test 18 of test.js
 *
 * @param {number} teamID ID of the team to lookup
 * @return {Promise} Resolves to JS Object with all the team details, rejects on error
 */
export async function getTeamDetails (teamID) {
  return new Promise((resolve, reject) => {
    if (!ObjectId.isValid(teamID)) {
      reject(new Error('Bad teamID, not a valid ObjectId'))
    }

    retrieveDBHandle('karunaData')
      .then((DBHandle) => {
        DBHandle.collection('Teams').findOne({ _id: new ObjectId(teamID) })
          .then((result) => { return resolve(result) })
          .catch((err) => { return reject(err) })
      })
      .catch((err) => { return reject(err) })
  })
}

/**
 * Create new team and optionally add user to the team.
 *
 * tested in test 5 of test.js
 *
 * @param {string} name Name for the new team
 * @param {string} description Description for the new team (may be empty)
 * @param {string} culture Culture document in markdown format (may be empty)
 * @param {string} commModelLink External URL for the team communication model (may be empty)
 * @param {number} unitID ID of the related unit (may be empty)
 * @param {number} userID ID of a user to add to the team (may be empty)
 * @return {number} ID of the newly created team or null if creation fails
 */
export function createTeam (name, description, culture, commModelLink, unitID, userID) {
  const insertThis = {
    name,
    description,
    culture,
    commModelLink,
    unitID: (ObjectId.isValid(unitID) ? new ObjectId(unitID) : undefined)
  }

  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Teams')
        .insertOne(insertThis, (err, result) => {
          if (err) {
            debug('Failed to create team')
            debug(err)
            return reject(err)
          } else {
            debug('Team created')
            if (userID) {
              debug('adding ' + userID + ' to team')
              addToTeam(userID)
            }
            return resolve(result)
          }
        })
    })
  })
}

/**
 * Drop the given team from the database
 *
 * tested in test 8 of test.js
 *
 * @param {number} teamID ID of the team to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export async function removeTeam (teamID) {
  const DBHandle = await retrieveDBHandle('karunaData')
  return DBHandle.collection('Teams').findOneAndDelete({ _id: new ObjectId(teamID) })
}

/**
 * Update a team entry in the database with new data
 *
 * tested in test 19 of test.js
 *
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the team document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateTeam (userID, newData) {
  return new Promise((resolve, reject) => {
    // Make sure foreign key is the proper ObjectId type (if its defined)
    if (newData.orgId && (typeof newData.orgId !== 'object' || !(newData.orgId instanceof ObjectId))) {
      newData.orgId = new ObjectId(newData.orgId)
    }

    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Teams').findOneAndUpdate(
        { _id: new ObjectId(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update team')
            debug(err)
            return reject(err)
          }
          return resolve()
        }
      )
    })
  })
}

/**
 * Test if a user is a manager on a particular team
 * @param {string} userID ObjectId of the user you are testing the status of
 * @param {*} teamID ObjectId of the team you are testing the status on
 * @returns {Promise} Resolves to true if the given user is a manager on the given team (and both exist)
 */
export async function managerOfTeam (userID, teamID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Teams').findOne(
        { _id: new ObjectId(userID), managers: new ObjectId(userID) },
        { projection: { _id: 0, teams: 1 } }
      ).then((team) => {
        return resolve(team !== null && team !== undefined)
      }).catch((err) => { return reject(err) })
    })
  })
}

/**
 * List teams in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
 *
 * tested in test 4 of test.js
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
 * List all the teams that belong to a certain org-unit. This is a convenience function that calls
 * listTeams with a pre-made filter for the org-unit ID.
 *
 * Tested in test 10 of test.js
 *
 * @param {string} unitID ObjectId string of an existing org-unit
 * @returns {Promise} Resolves to list of units on success, rejects with error on failure
 */
export function listTeamsInUnit (unitID) {
  // Check for proper UnitID
  if (!ObjectId.isValid(unitID)) {
    return Promise.reject(new Error('UnitID must be defined'))
  }

  return new Promise((resolve, reject) => {
    // Retrieve unit details
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Units')
        .findOne({ _id: new ObjectId(unitID) }, (err, result) => {
          // Check for and handle error
          if (err) {
            debug('Error retrieving unit for "listTeamsInUnit"')
            debug(err)
            return reject(err)
          }

          // For invalid unitID (does not exist)
          if (!result) { return resolve([]) }

          // Reshape unit data (removing id)
          const unitData = {
            unitName: result.name,
            unitDescription: result.description,
            unitAdminId: result.adminId
          }

          // Retrieve filtered list of teams with unit info joined
          DBHandle.collection('Teams').aggregate([
            { $match: { orgId: new ObjectId(unitID) } },
            { $addFields: unitData }
          ]).toArray((err, docs) => {
            if (err) {
              debug('Cursor toArray failed for "listTeamsInUnit"')
              debug(err)
              return reject(err)
            }

            // Resolve with the results
            return resolve(docs)
          })
        })
    })
  })
}

/**
 * Add a user to a given team
 *
 * tested in test 6 of test.js
 *
 * @param {string} userID The id of the user to add
 * @param {string} teamID The id of the team to add them too
 * @return {Promise} Resolves with 'true' on success, rejects on error
 */
export function addToTeam (userID, teamID) {
  if (!ObjectId.isValid(userID) || !ObjectId.isValid(teamID)) {
    return Promise.reject(new Error('Either userID or teamID is invalid'))
  }

  return new Promise((resolve, reject) => {
    // Get database handle
    retrieveDBHandle('karunaData').then((DBHandle) => {
      // Update user record to include indicated team
      DBHandle.collection('Users')
        .update(
          { _id: new ObjectId(userID) },
          { $push: { teams: new ObjectId(teamID) } }
        ).then(() => { return resolve('true') })
        .catch((err) => { return reject(err) })
    })
  })
}

/**
 * List all the users that belong to a certain team.
 *
 * @param {string} teamID ObjectId string of an existing team
 * @returns {Promise} Resolves to array of affect id strings on success, rejects with error on failure
 */
export function getTeamAffectTemperature (teamID) {
  // Check for proper TeamID
  if (!teamID) {
    return Promise.reject(new Error('TeamID must be defined'))
  }

  return new Promise((resolve, reject) => {
    // Retrieve team details
    retrieveDBHandle('karunaData').then((DBHandle) => {
      try {
        DBHandle.collection('Teams').findOne({ _id: new ObjectId(teamID) }, (err, result) => {
          // Check for and handle error
          if (err) {
            debug('Error retrieving team for "listUserAffectsInTeam"')
            debug(err)
            return reject(err)
          }

          // For invalid teamID (does not exist)
          if (!result) { return resolve({ error: true, message: 'Team not found' }) }

          // Retrieve filtered list of users (w/o sensitive info) with team info joined
          DBHandle.collection('Users').aggregate([
            { $match: { teams: new ObjectId(teamID) } },
            {
              $lookup: {
                from: 'Affects',
                localField: 'status.currentAffectID',
                foreignField: '_id',
                as: 'userAffects'
              }
            },
            { $unwind: { path: '$userAffects', preserveNullAndEmptyArrays: true } },
            {
              $group: { _id: null, avgTemp: { $avg: '$userAffects.positivity' } }
            }
            // {
            //   $project: { temp: '$userAffects.positivity', _id: 0 }
            // }
          ]).toArray((err, docs) => {
            if (err) {
              debug('Cursor toArray failed for "listUserAffectsInTeam"')
              debug(err)
              return reject(err)
            }
            // Resolve with the results
            return resolve(docs)
          })
        })
      } catch (err) {
        return resolve({ error: true, message: err.toString() })
      }
    })
  })
}
