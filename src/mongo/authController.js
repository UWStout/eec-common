// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// Password hashing library
import bcrypt from 'bcrypt'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

const debug = Debug('mongo:authController')

// How many rounds to use when generating hash salt for passwords
const SALT_ROUNDS = 10

/**
 * Validate user credentials
 * tested in test 1 in test.js
 * @param {string} email The email of the user in the database
 * @param {string} plainPassword Plaintext password
 * @return {Promise} Resolves to object with basic user info, rejects if invalid
 */
export function validateUser (email, password) {
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users')
        // Find user with matching email (leave out teams and meta in returned document)
        .findOne({ email }, { projection: { teams: 0, meta: 0 } }, (err, result) => {
          // Check for an error
          if (err || !result) {
            debug(`User not found "${email}"`)
            if (err) { debug(err) }
            return reject(new Error('Invalid email or password'))
          }

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

            // Sanitize and return userInfo
            return resolve({
              id: result._id,
              email: result.email,
              firstName: result.firstName,
              lastName: result.lastName,
              userType: result.userType
            })
          })
        })
    })
  })
}

/**
 * Create a new user in the database
 * tested in test 3 of test.js
 * @param {string} firstName First name of the user to create
 * @param {string} lastName Last name of the user to create
 * @param {string} email email of the user to create
 * @param {string} userType User account type ('standard' or 'admin')
 * @param {string} password Plaintext password
 * @return {Promise} Rejects on failure, resolves to the newly created ID on success
 */
export function createUser (firstName, lastName, email, userType, password) {
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
      retrieveDBHandle('karunaData').then((DBHandle) => {
        DBHandle.collection('Users')
          .insertOne({ firstName, lastName, email, userType, passwordHash, teams: [], meta: {} })
          .then((result) => { return resolve() })
          .catch((error) => {
            debug('Failed to insert new user')
            debug(error)
            return reject(error)
          })
      })
    })
  })
}
