import { retrieveDBHandle } from './connect.js'

// To deal with ObjectIDs in the mongo format
import { ObjectID } from 'mongodb'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

/**
 * Retrieve the number of users in the user table
 *
 * tested in test 22 of test.js
 *
 * @return {Promise} Resolves to the number of users, rejects on error
 */
export function getUserCount () {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle.collection('Users').estimatedDocumentCount()
}

/**
 * Retrieve all the details for a given userID
 *
 * tested in test 15 of test.js
 *
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Users')
    .findOne({ _id: new ObjectID(userID) }, { projection: { passwordHash: 0 } })
}

/**
 * Check if a user already exists for the given email
 *
 * tested in test 2 of test.js
 *
 * @param {string} email ID of the user in the database
 * @return {Promise} Resolves to the userID or -1 if no user exists
 */
export function emailExists (email) {
  const DBHandle = retrieveDBHandle('karunaData')
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
 * List users in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
 *
 * tested in test 12 of test.js
 *
 * @param {bool} IDsOnly Include only IDs in the results
 */
export function listUsers (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  let project = null
  let lookup = null
  if (IDsOnly) {
    project = { _id: 1 }
  } else {
    // Build lookup object to merge 'teams' into results
    lookup = {
      $lookup: {
        from: 'Teams',
        localField: 'teams',
        foreignField: '_id',
        as: 'teams'
      }
    }
  }

  return listCollection('Users', lookup, project, perPage, page, sortBy, sortOrder, filterBy, filter)
}

/**
 * Update a user entry in the database with new data
 *
 * tested in test 13 of test.js
 *
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the user document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUser (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update user')
            debug(err)
            return reject(err)
          }
          resolve()
        }
      )
  })
}

/**
 * Update a user's recent activity timestamps
 * @param {number} userID ID of the user to update
 * @param {string} remoteAddress New IP address to set as source of the activity.
 * @param {string[]|bool} context Pass 'true' to indicate a wizard login, otherwise, pass array of
 *                                active contexts. If empty or false-ish, will treat as a standard login.
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUserTimestamps (userID, remoteAddress, context) {
  // Ensure userID is defined
  if (!userID) {
    return Promise.reject(new Error('UserId must be defined'))
  }

  // Setup new data for database
  const newData = {}
  if (context === true) {
    // Build last login object for a wizard
    newData.lastWizardLogin = {
      timestamp: new Date(),
      remoteAddress
    }
  } else if (!Array.isArray(context) || context.length === 0) {
    // Build last login object
    newData.lastLogin = {
      timestamp: new Date(),
      remoteAddress
    }
  } else {
    // Build updated context timestamp list
    newData.lastContextLogin = {}
    context.forEach((contextName) => {
      newData.lastContextLogin[contextName] = {
        timestamp: new Date(),
        remoteAddress
      }
    })
  }

  // Update user record with the new data
  return new Promise((resolve, reject) => {
    const DBHandle = retrieveDBHandle('karunaData')
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update user')
            debug(err)
            return reject(err)
          }
          resolve()
        }
      )
  })
}

/**
 * Drop a user from the database
 *
 * tested in test 16 of test.js
 *
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  const DBHandle = retrieveDBHandle('karunaData')
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
