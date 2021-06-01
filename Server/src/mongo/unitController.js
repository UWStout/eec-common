// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

const debug = Debug('mongo:unitController')

/**
 * Retrieve details for the given organizational unit
 *
 * tested in test 17 of test.js
 *
 * @param {number} unitID ID of the org unit to lookup
 * @return {Promise} Resolves to JS Object with all the org unit details, rejects on error
 */
export async function getOrgUnitDetails (unitID) {
  const DBHandle = await retrieveDBHandle('karunaData')
  return DBHandle.collection('Units')
    .findOne({ _id: new ObjectID(unitID) })
}

/**
 * Create new organization unit (teams are housed under units)
 *
 * tested in test 7 of test.js
 *
 * @param {string} unitName Name for the new org unit
 * @param {string} description Description of the org unit (may be null)
 * @param {string} adminID ID of admin user (may be null)
 * @return {Promise} Resolves to ID of the newly created org unit, rejects if creation fails
 */
export async function createOrgUnit (unitName, description, adminID) {
  const insertThis = {
    unitName,
    description,
    adminID: (ObjectID.isValid(adminID) ? new ObjectID(adminID) : undefined)
  }

  const DBHandle = await retrieveDBHandle('karunaData')
  return DBHandle.collection('Units').insertOne(insertThis)
}

/**
 * Drop the given organization unit from the database
 *
 * tested in test 9 of test.js
 *
 * @param {number} unitID ID of the org unit to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeOrgUnit (unitID) {
  // TODO: Do something with all teams in that org unit
  // What could we do?
  // - Only remove an org if all teams are already deleted
  // - Set the 'unitID' to null in all teams of that unit
  // - Automatically delete all teams in the unit

  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Units')
        .findOneAndDelete({ _id: new ObjectID(unitID) })
        .then(result => { resolve(true) })
        .catch(() => { resolve(false) })
    })
  })
}

/**
 * Update an org unit entry in the database with new data
 *
 * tested in test 23 of test.js
 *
 * @param {string} userID ID of the user to update
 * @param {Object} newData New data for the org unit document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateOrgUnits (userID, newData) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Units')
        .findOneAndUpdate(
          { _id: new ObjectID(userID) },
          { $set: { ...newData } },
          (err, result) => {
            if (err) {
              debug('Failed to update org unit')
              debug(err)
              return reject(err)
            }
            resolve()
          }
        )
    })
  })
}

/**
 * List units in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
 *
 * tested in test 24 of test.js
 *
 * @param {bool} IDsOnly Include only IDs in the results
 */
export function listOrgUnits (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  // Build projection object if needed
  let project = null
  if (IDsOnly) {
    project = { _id: 1 }
  }

  // Execute collection list query
  return listCollection('Units', null, project, perPage, page, sortBy, sortOrder, filterBy, filter)
}
