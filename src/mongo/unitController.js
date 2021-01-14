import { retrieveDBHandle } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

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
 * Update an org unit entry in the database with new data
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the org unit document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateOrgUnits (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
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
}

/**
 * List units in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
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
