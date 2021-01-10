import { retrieveDBHandle } from './connect.js'
// for using the database
import { ObjectID } from 'mongodb'

// Password hashing library
import bcrypt from 'bcrypt'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

// How many rounds to use when generating hash salt for passwords
const SALT_ROUNDS = 10

/**
 * Retrieve all the details for a given userID
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return DBHandle
    .collection('Users')
    .findOne({ _id: new ObjectID(userID) })
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

/**
 * Validate user credentials
 * @param {string} email The email of the user in the database
 * @param {string} plainPassword Plaintext password
 * @return {Promise} Resolves to object with basic user info but not the pass, rejects if invalid
 */
export function validateUser (email, password) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Users')
      .findOne({ email: email }, (err, result) => {
        // Check for an error
        if (err) {
          debug('Error looking for user')
          debug(err)
          return reject(err)
        }

        // check if findOne failed
        if (result == null) {
          debug(`User not found "${email}"`)
          return reject(err('user not found'))
        } else {
          // Hash and validate the password (it is stored hashed)
          bcrypt.compare(password, result.passwordHash, (error, valid) => {
          // Check if an error occurred
            if (error) {
              debug('Error hashing password')
              debug(err)
              return reject(error)
            }
            // Was the password valid
            if (!valid) {
              debug('Password failed hash check')
              return reject(new Error('Invalid email or password'))
            }

            // Return the email and row data (without password) merged
            result.passwordHash = undefined
            // potentially could try to return result now that the password hash was set to undefined
            return resolve(result)
          })
        }
      })
  })
}

/**
 * Create a new user in the database
 * @param {string} firstName First name of the user to create
 * @param {string} lastName Last name of the user to create
 * @param {string} email email of the user to create
 * @param {string} type User account type ('standard' or 'admin')
 * @param {string} password Plaintext password
 * @return {Promise} Rejects on failure, resolves to the newly created ID on success
 */
export function createUser (firstName, lastName, email, type, password) {
  return new Promise((resolve, reject) => {
    // Hash password
    bcrypt.hash(password, SALT_ROUNDS, (err, passwordHash) => {
      // Check if an error occurred
      if (err) {
        debug('Failed to hash password')
        debug(err)
        return reject(err)
      }

      // Make new user data entry
      const DBHandle = retrieveDBHandle('karunaData', true, true)
      DBHandle.collection('Users')
        .insertOne({ firstName, lastName, email, type, passwordHash, meta: {} })
        .then((result) => { return resolve() })
        .catch((error) => {
          debug('Failed to insert new user')
          debug(error)
          return reject(error)
        })
    })
  })
}
