// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// For using the database
import MongoDB from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('karuna:mongo:affectController')

// Re-export closeClient
export { closeClient }

// Extract ObjectID for easy usage
const { ObjectID } = MongoDB

/* Affect Functions */

/**
 * Retrieve details for the given Affect
 *
 * tested with test 25 in test.js
 *
 * @param {number} affectID ID of the affect to lookup
 * @return {Promise} Resolves to JS Object with all the affect details, rejects on error
 */
export async function getAffectDetails (affectID) {
  const DBHandle = await retrieveDBHandle('karunaData')
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

  // Insert the affect asynchronously
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Affects').insertOne(insertThis, (err, result) => {
        if (err) { return reject(err) }
        return resolve(result.insertedId)
      })
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
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Affects')
        .findOneAndDelete({ _id: new ObjectID(affectID) })
        .then(result => { return resolve() })
        .catch((err) => { return reject(err) })
    })
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
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
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

/**
 * @param {*} affectID  the mongo ID string that needs to be wrapped in an ObjectID before being pushed to the database
 * @param {*} userID the mongo ID string that needs to be wrapped in an ObjectID before being pushed to the database
 * @returns {Promise} Resolves with no data if successful, rejects on error
 */
export function setFavoriteAffect (affectID, userID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users')
        .findOneAndUpdate(
          { _id: new ObjectID(userID) },
          {
            $addToSet: { favoriteAffects: affectID }
          },
          (err, result) => {
            if (err) {
              debug('Failed to add affect to user favorites')
              debug(err)
              return reject(err)
            }
            return resolve()
          }
        )
    })
  })
}

export function listFavoriteAffects (userID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users')
        .find({ _id: new ObjectID(userID) }, { favoriteAffects: 1 })
        .toArray(function (err, result) {
          if (err) {
            debug('Failed to list favorite affects')
            debug(err)
            return reject(err)
          }
          resolve(result[0].favoriteAffects)
        })
    })
  })
}

/* Affect History functions */

/**
 * Insert an affect log into the affect history collection
 *
 * tested in test 30 of test.js in the routes folder
 *
 * Each entry needs, at a minimum, an affectID (from the affect table), a userID OR a teamID, and a timestamp
 * @param {string} affectID from the affect table
 * @param {string} relatedID can be either a userID or a teamID, but we will never log both. ONE needs to be given.
 * @param {bool} isUser true if it is a userID, else false if it is a teamID
 * @param {bool} isPrivate if null/undefined it is pushed as false, else it is pushed as its value (either true or false).
 * @return {Promise} returns an inserted object
 */
export async function insertAffectHistoryEntry (affectID, relatedID, isUser, isPrivate) {
  // Ensure isPrivate has a default value
  if (isPrivate === undefined || isPrivate === null) { isPrivate = true }

  // Build proper object to insert
  const insertThis = {
    affectID: new ObjectID(affectID),
    timestamp: new Date(),
    isPrivate
  }

  // Set either a user or team id as relatedID
  if (isUser) {
    insertThis.userID = new ObjectID(relatedID)
  } else {
    insertThis.teamID = new ObjectID(relatedID)
  }

  // Start affect history entry query
  const DBHandle = await retrieveDBHandle('karunaData')
  const promises = [
    DBHandle.collection('AffectHistory').insertOne(insertThis)
  ]

  // Possibly start user current mood update query
  if (isUser) {
    promises.push(DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(relatedID) },
        {
          $set: {
            'status.currentAffectID': new ObjectID(affectID),
            'status.currentAffectPrivacy': isPrivate
          }
        }
      )
    )
  }

  // Return a promise that resolves when both are finished and rejects otherwise
  return Promise.all(promises)
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
export function listAffectHistory (userID, affectLogID, dateStart, dateEnd) {
  // Setup an operator to filter by date range
  let findThis = {}
  if (affectLogID) {
    findThis = { _id: new ObjectID(affectLogID) }
  } else if (dateStart && dateEnd) { // finds timestamps within (inclusive) two dates
    findThis = { timestamp: { $gte: new Date(dateStart), $lte: new Date(dateEnd) } }
  } else if (dateStart) { // finds timestamps after a certain date (inclusive)
    findThis = { timestamp: { $gte: new Date(dateStart) } }
  } else if (dateEnd) { // finds timestamps before a certain date (inclusive)
    findThis = { timestamp: { $lte: new Date(dateEnd) } }
  } else if (userID) {
    findThis = {
      $where: function () {
        const deepIterate = function (obj, value) {
          for (const field in obj) {
            if (obj[field] === value) {
              return true
            }
            let found = false
            if (typeof obj[field] === 'object') {
              found = deepIterate(obj[field], value)
              if (found) { return true }
            }
          }
          return false
        }
        return deepIterate(this, userID)
      }
    }
  }

  // necessary for sorting by timestamp
  const sort = { _id: -1 }

  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('AffectHistory')
        .find(findThis).sort(sort)
        .toArray(function (err, result) {
          if (err) {
            debug('Failed to find affect history')
            debug(err)
            return reject(err)
          }
          resolve(result)
        })
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
  let removeOne
  if (dateRange) removeOne = false
  else removeOne = true

  let removeThis
  if (removeOne) removeThis = { _id: new ObjectID(affectLogID) }
  else removeThis = { timestamp: { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1]) } }

  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('AffectHistory')
        .deleteMany(removeThis, { justOne: removeOne })
        .then(result => { return resolve() })
        .catch((err) => { return reject(err) })
    })
  })
}
