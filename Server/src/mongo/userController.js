import { retrieveDBHandle } from './connect.js'

// To deal with ObjectIDs in the mongo format
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

/**
 * Retrieve all the details for a given userID
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return DBHandle
    .collection('Users')
    .findOne({ _id: new ObjectID(userID) }, { projection: { passwordHash: 0 } })
}

/**
 * Check if a user already exists for the given email
 * @param {string} email ID of the user in the database
 * @return {Promise} Resolves to the userID or -1 if no user exists
 */
export function emailExists (email) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
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
 * List users in the database with pagination
 * @param {number} perPage Number of users per page (defaults to 25)
 * @param {number} page Page of results to skip to (defaults to 1)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function listUserIDs (perPage = 25, page = 1) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    const skip = (page - 1) * perPage
    const limit = perPage
    DBHandle.collection('Users')
      // Empty query gets all items, project to just the IDs + skip and limit results
      .find({}).skip(skip).limit(limit).project({ _id: 1 }).toArray((err, userIDArray) => {
        // Something went wrong
        if (err) {
          debug('Failed to retrieve user list')
          debug(err)
          return reject(err)
        }

        // Return the array of IDs
        return resolve(userIDArray)
      })
  })
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the user document
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUser (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) { return reject(err) }
          resolve()
        }
      )
  })
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
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
