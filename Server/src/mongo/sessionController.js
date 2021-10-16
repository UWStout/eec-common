// New DB connector
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// To deal with ObjectIDs in the mongo format
import MongoDB from 'mongodb'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

// Extract ObjectId for easy usage
const { ObjectId } = MongoDB
const debug = Debug('karuna:mongo:sessionController')

/**
 * Create a new session for a given socketID
 *
 * @param {string} socketID ID of the socket session to create
 * @return {Promise} Resolves on success with result object, rejects on error
 */
function startSession (socketID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Sessions').insertOne(
        { socketID }
      ).then((result) => {
        return resolve(result)
      }).catch((err) => {
        return reject(err)
      })
    })
  })
}

/**
 * Lookup an existing session (fails if session does not already exist)
 *
 * @param {string} socketID ID of the socket for which a session exists
 * @returns {Promise} Resolves to session document on success, rejects on error of is session does not exist
 */
function getExistingSession (socketID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Sessions').findOne(
        { socketID: new ObjectId(socketID) },
        (sessionDoc, err) => {
          if (err) {
            return reject(err)
          } else {
            return resolve(sessionDoc)
          }
        }
      )
    })
  })
}

/**
 * Lookup an existing session (one of either email or userID must be defined)
 *
 * @param {string} email Email of user to lookup session (optional)
 * @param {string} userID Internal ID of the user to lookup session (optional)
 * @returns {Promise} Resolves to session document or empty document, rejects only on error
 */
function lookupSession (email, userID) {
  return new Promise((resolve, reject) => {
    // Sanity check
    if (!email && !userID) {
      return reject(new Error('One of either email or userID must be defined'))
    }

    // Create search object
    const searchObj = {
      userEmail: email,
      userID: (ObjectId.isValid(userID) ? new ObjectId(userID) : undefined)
    }

    // Do query
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Sessions').findOne(
        searchObj,
        (sessionDoc, err) => {
          if (err) {
            return reject(err)
          } else {
            return resolve(sessionDoc)
          }
        }
      )
    })
  })
}

/**
 * Update a session in the database with new data
 *
 * @param {number} socketID ID of the socket session we want to update
 * @param {Object} newData New data for the socket document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
function updateExistingSession (socketID, newData) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Sessions').findOneAndUpdate(
        { socketID: new ObjectId(socketID) },
        { $set: { ...newData } }
      ).then((result) => {
        return resolve()
      }).catch((err) => {
        return reject(err)
      })
    })
  })
}

/**
 * Drop a session from the database
 *
 * @param {number} socketID ID of the socket session we want to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
function removeExistingSession (socketID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Sessions').findOneAndDelete(
        { socketID: new ObjectId(socketID) }
      ).then(result => {
        return resolve()
      }).catch(error => {
        return reject(error)
      })
    })
  })
}

/**
 * Check if session is active
 *
 * @param {number} socketID ID of the socket session we want to locate
 * @return {Promise} Resolves with no data if session exists, rejects on error
 */
export function isSessionActive (socketID) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Sessions').findOne(
        { socketID: new ObjectId(socketID) }
      ).then((result) => {
        return resolve()
      }).catch((err) => {
        return reject(err)
      })
    })
  })
}

/**
 * Retrieve a session for a given socketID or create one if it doesn't exist
 *
 * @param {string} socketID ID of the socket session to retrieve
 * @return {Promise} Resolves to an object with all the session data, resolves to null on error
 */
export async function getSession (socketID) {
  // Does this session already exist ?
  try {
    const sessionExists = await isSessionActive(socketID)
    if (sessionExists) {
      // Retrieve existing session
      const sessionDoc = await getExistingSession(socketID)
      return sessionDoc
    } else {
      // Make a new session
      const sessionDoc = await startSession(socketID)
      return sessionDoc
    }
  } catch (err) {
    debug('Failed to retrieve/create session')
    debug(err)
    return null
  }
}

/**
 * Update/create a session with the given data
 *
 * @param {string} socketID The id of the socket from Socket.io for this session
 * @param {object} newData Data to either update or add to the existing document
 * @returns {Promise} Resolves to new session document on success, resolves to null on error
 */
export async function updateSession (socketID, newData) {
  try {
    // Does this session already exist?
    const sessionExists = await isSessionActive(socketID)
    if (!sessionExists) {
      // Make a new session first
      await startSession(socketID)
    }

    // update the session (brand new or existing)
    const sessionDoc = await updateExistingSession(socketID, newData)
    return sessionDoc
  } catch (err) {
    debug('Failed to update session')
    debug(err)
    return null
  }
}

/**
 * Drop a session from the database if it exists
 *
 * @param {number} socketID ID of the socket session we want to remove
 * @return {Promise} Resolves with no data if successful, does nothing if session does not exist
 */
export async function endSession (socketID) {
  try {
    // Does this session already exist?
    const sessionExists = await isSessionActive(socketID)
    if (sessionExists) {
      // Remove it
      await removeExistingSession(socketID)
    }
  } catch (err) {
    debug('Failed to end session')
    debug(err)
    return null
  }
}

/**
 * Lookup an existing session SocketID from a user's email or internal id
 *
 * @param {string} userEmail Email of the user's session you want to lookup
 * @param {string} userID ID of the user's session you want to lookup
 * @returns {Promise} Resolves to the socketID on success, resolves to null if does not exist or error occurs
 */
export async function lookupSocket (userEmail, userID) {
  try {
    // Does this session already exist?
    const session = await lookupSession(userEmail, userID)
    if (session) { return session.socketID }
  } catch (err) {
    debug('Failed to lookup session')
    debug(err)
  }

  // Error occurred or no session found
  return null
}
