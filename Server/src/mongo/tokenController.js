// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

import MongoDB from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('karuna:mongo:tokenController')

// Re-export closeClient
export { closeClient }

// Extract ObjectId class for easy of use
const { ObjectId } = MongoDB

/**
 * Record a new token with an expiration date
 *
 * @param {string} userId the user associated with the token
 * @param {string} token the JWT for this user's session
 * @param {Date} expires the expiration date for this token
 * @return {Promise} A promise that resolves to a document (see MongoDB.insertOne() for details):
 *                    - A field 'insertedId' with the _id value of the inserted document.
 */
export async function addToken (userId, token, expires) {
  // userID is required
  if (!ObjectId.isValid(userId)) {
    throw new Error('A valid ObjectId is required for the userID')
  }

  // Build the insertion document
  const insertThis = {
    userId: new ObjectId(userId), token, expires
  }

  // Get DB handle and insert it
  const DBHandle = await retrieveDBHandle('karunaData')
  return DBHandle.collection('Tokens').insertOne(insertThis)
}

/**
 * Check if an existing token is in the DB
 *
 * @param {string} userId the user associated with the token
 * @param {string} token the JWT for this user's session
 * @return {Promise} A promise that resolves if the token is found and rejects otherwise
 */
export function findToken (userId, token) {
  // userID is required
  if (!ObjectId.isValid(userId)) {
    return Promise.reject(new Error('A valid ObjectId is required for the userID'))
  }

  return new Promise((resolve, reject) => {
    // Get DB handle and insert it
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Tokens').findOne(
        { userId: new ObjectId(userId), token },
        (err, result) => {
          // Check for error or empty result
          if (err || !result) {
            debug('Token not found')
            if (err) { debug(err) }
            return reject(new Error('Invalid token'))
          }

          // Resolve as a valid token
          return resolve(true)
        }
      )
    })
  })
}

/**
 * Remove an existing token from the DB
 *
 * @param {string} userId the user associated with the token
 * @param {string} token the JWT for this user's session
 * @return {Promise} A promise that resolves if the token is found and deleted and rejects otherwise
 */
export function removeToken (userId, token) {
  // userID is required
  if (!ObjectId.isValid(userId)) {
    return Promise.reject(new Error('A valid ObjectId is required for the userID'))
  }

  return new Promise((resolve, reject) => {
    // Get DB handle and insert it
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Tokens')
        .findOneAndDelete({ userId: new ObjectId(userId), token })
        .then(result => { return resolve() })
        .catch(error => {
          debug('Failed to remove token')
          debug(error)
          return reject(error)
        })
    })
  })
}
