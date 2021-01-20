import { retrieveDBHandle } from './connect.js'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

/**
 * Retrieve details for the given Affect
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
 * @param {string} affectName Name for the new Affect
 * @param {string} description Verbal description of this affect (may be null)
 * @param {string[]} characterCode Unicode emojis/characters for this affect (may be empty)
 * @param {string[]} relatedIDs Array of related affect IDs (may be empty)
 * @return {Promise} Resolves to ID of the newly created affect, rejects if creation fails
 */
export function createAffect (affectName, description, characterCode, relatedIDs) {
  return new Promise((resolve, reject) => {
    // Start to build the affect
    const insertThis = { name: affectName, description, characterCode: [], related: [], active: true }

    // Ensure the character codes are in an array
    if (!Array.isArray(characterCode)) {
      if (characterCode) {
        insertThis.characterCode.push(characterCode)
      }
    } else {
      insertThis.characterCode = [...characterCode]
    }

    // Ensure related IDs are an array and are proper ObjectIDs
    if (!Array.isArray(relatedIDs)) {
      if (relatedIDs) {
        insertThis.related.push(new ObjectID(characterCode))
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
 * @param {number} affectID ID of the user to update
 * @param {Object} newData New data for the affect document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateAffect (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle.collection('Affects')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
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
