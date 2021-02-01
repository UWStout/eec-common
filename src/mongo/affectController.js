import { retrieveDBHandle } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

/* Affect Functions */

/**
 * Retrieve details for the given Affect
 *
 * tested with test 25 in test.js
 *
 * @param {number} affectID ID of the affect to lookup
 * @return {Promise} Resolves to JS Object with all the affect details, rejects on error
 */
export function getAffectDetails (affectID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle.collection('Affects')
    .findOne({ _id: new ObjectID(affectID) })
}

/**
 * Create new affect
 *
 * tested within test 26 of test.js
 *
 * @param {string} affectName Name for the new Affect
 * @param {string} description Verbal description of this affect (may be null)
 * @param {string[]} characterCodes Unicode emojis/characters for this affect (may be empty)
 * @param {string[]} relatedIDs Array of related affect IDs (may be empty)
 * @return {Promise} Resolves to ID of the newly created affect, rejects if creation fails
 */
export function createAffect (affectName, description, characterCodes, relatedIDs) {
  return new Promise((resolve, reject) => {
    // Start to build the affect
    const insertThis = { name: affectName, description, characterCodes: [], related: [], active: true }

    // Ensure the character codes are in an array
    if (!Array.isArray(characterCodes)) {
      if (characterCodes) {
        insertThis.characterCodes.push(characterCodes)
      }
    } else {
      insertThis.characterCodes = [...characterCodes]
    }

    // Ensure related IDs are an array and are proper ObjectIDs
    if (!Array.isArray(relatedIDs)) {
      if (relatedIDs) {
        insertThis.related.push(new ObjectID(relatedIDs))
      }
    } else {
      insertThis.related = relatedIDs.map((relID) => (new ObjectID(relID)))
    }

    // Insert the affect and return the related promise
    const DBHandle = retrieveDBHandle('karunaData')
    return DBHandle.collection('Affects').insertOne(insertThis, (err, result) => {
      if (err) { return reject(err) }
      return resolve(result.insertedId)
    })
  })
}

/**
 * Drop the given affect document from the database
 *
 * tested in test 27 of test.js
 *
 * @param {string} affectID ID of the affect to destroy (must exist in DB)
 * @return {Promise} Resolves only if the removal was successful, rejects otherwise
 */
export function removeAffect (affectID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle.collection('Affects')
      .findOneAndDelete({ _id: new ObjectID(affectID) })
      .then(result => { return resolve() })
      .catch((err) => { return reject(err) })
  })
}

/**
 * Update an affect entry in the database with new data
 *
 * tested within test 28 of test.js
 *
 * @param {number} affectID ID of the user to update
 * @param {Object} newData New data for the affect document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateAffect (affectID, newData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle.collection('Affects')
      .findOneAndUpdate(
        { _id: new ObjectID(affectID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update affect')
            debug(err)
            return reject(err)
          }
          return resolve()
        }
      )
  })
}

/**
 * List affects in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
 *
 * tested in test 29 of test.js
 *
 * @param {bool} IDsOnly Include only IDs in the results
 */
export function listAffects (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  // Build projection object if needed
  let project = null
  if (IDsOnly) {
    project = { _id: 1 }
  }

  // Execute collection list query
  return listCollection('Affects', null, project, perPage, page, sortBy, sortOrder, filterBy, filter)
}

/* Affect History functions */

/**
 * Insert an affect log into the affect history collection
 *
 * tested in test 30 of test.js in the routes folder
 *
 * Each entry needs, at a minimum, an affectID (from the affect table), a userID OR a teamID, and a timestamp
 * @param {_id} affectID from the affect table
 * @param {_id} relatedID can be either a userID or a teamID, but we will never log both. ONE needs to be given.
 * @param {_bool} isUser true if it is a userID, else false if it is a teamID
 */
export function insertAffectHistoryEntry (affectID, relatedID, isUser) {
  const DBHandle = retrieveDBHandle('karunaData')
  let insertThis

  if (isUser) { // relatedID is a userID
    insertThis = { affectID: new ObjectID(affectID), userID: new ObjectID(relatedID), timestamp: new Date() }
  } else { // relatedID is a teamID
    insertThis = { affectID: new ObjectID(affectID), teamID: new ObjectID(relatedID), timestamp: new Date() }
  }
  return DBHandle
    .collection('AffectHistory')
    .insertOne(insertThis)
}

/**
 * this is a function to retrieve affect history with support to filter by date range and user/team ID
 * If affectLogID is given, it will search for this ID, else if two dates are given, it will look between them for timestamps
 * If only dateStart is given, it will find all of the timestamps after this date (inclusive)
 * If only dateEnd is given, it will find all of the timestamps before this date (inclusive)
 *
 * @param {_id} affectLogID the ID of the log being found (can be null)
 * @param {String} dateStart the Date to look for dates after this given date (can be null)
 * @param {String} dateEnd the Date to look before for other dates (can be null)
 * @return {Promise} Resolves only if the query was successful, rejects otherwise
 */
export function listAffectHistory (affectLogID, dateStart, dateEnd) {
  const DBHandle = retrieveDBHandle('karunaData')

  let findThis
  if (affectLogID) {
    findThis = { _id: new ObjectID(affectLogID) }
  } else if (dateStart && dateEnd) { // finds timestamps within (inclusive) two dates
    findThis = { timestamp: { $gte: new Date(dateStart), $lte: new Date(dateEnd) } }
  } else if (dateStart) { // finds timestamps after a certain date (inclusive)
    findThis = { timestamp: { $gte: new Date(dateStart) } }
  } else if (dateEnd) { // finds timestamps before a certain date (inclusive)
    findThis = { timestamp: { $lte: new Date(dateEnd) } }
  } else {
    findThis = {}
  }

  return new Promise((resolve, reject) => {
    DBHandle.collection('AffectHistory')
      .find(findThis)
      .toArray(function (err, result) {
        if (err) {
          debug('Failed to find affect history')
          debug(err)
          return reject(err)
        }
        resolve(result)
      })
  })
}

/**
 * function to remove a specific affect history entry
 * function to prune affect history for a specific user/team ID in a certain date range
 * will be given either, but not both nor neither, affectLogID or dateRange
 *
 * @param {_id} affectLogID the ID of the log being deleted (can be null if dateRange is not)
 * @param {Array} dateRange an array of 2 strings that represents the range of dates to delete affect History Logs within (if null, delete only one affect log)
 * @return {Promise} Resolves only if the removal was successful, rejects otherwise
 */
export function removeAffectHistoryEntry (affectLogID, dateRange) {
  const DBHandle = retrieveDBHandle('karunaData')

  let removeOne
  if (dateRange) removeOne = false
  else removeOne = true

  let removeThis
  if (removeOne) removeThis = { _id: new ObjectID(affectLogID) }
  else removeThis = { timestamp: { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1]) } }

  return new Promise((resolve, reject) => {
    DBHandle.collection('AffectHistory')
      .deleteMany(removeThis, { justOne: removeOne })
      .then(result => { return resolve() })
      .catch((err) => { return reject(err) })
  })
}
