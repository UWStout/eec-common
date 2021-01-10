// Import sqlite helper functions
import { retrieveDBHandle } from './connect.js'
import * as SQLHelp from './sqliteHelper.js'

/**
 * Retrieve all the details for a given userID
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  return SQLHelp.getEntryFromID(userID, 'Users')
}

/**
 * Check if a user already exists for the given email
 * @param {string} email ID of the user in the database
 * @return {Promise} Resolves to the userID or -1 if no user exists
 */
export function emailExists (email) {
  return SQLHelp.checkValueExistence('Users', 'email', email)
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  return SQLHelp.deleteEntryFromID(userID, 'Users')
}

/**
 * Add an affect for the indicated user at the indicated timestamp
 * @param {number} userID ID of the user to add the affect to
 * @param {number} affectID ID of the affect to add
 * @param {number} [timestamp] Unix timestap for the affect (defaults to current time)
 */
export function addAffectHistory (userID, affectID, timestamp) {

}
