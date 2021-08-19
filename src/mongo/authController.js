// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// Password hashing library
import bcrypt from 'bcrypt'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

const debug = Debug('karuna:mongo:authController')

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
        .findOne({ email }, { projection: { meta: 0 } }, (err, result) => {
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
              name: result.name,
              preferredName: result.preferredName,
              preferredPronouns: result.preferredPronouns,
              userType: result.userType,
              activeTeam: (result?.teams?.length > 0 ? result.teams[0] : ''),
              contextAlias: result.contextAlias
            })
          })
        })
    })
  })
}

/**
 * Create a new user in the database
 * tested in test 3 of test.js
 * @param {string} fullName Full real name of the user to create
 * @param {string} preferredName Nickname or preferred name of the user to create
 * @param {string} email email of the user to create
 * @param {string} password Plaintext password
 * @param {string} preferredPronouns The user's preferred pronouns (optional, defaults to empty)
 * @param {string} userType User account type ('standard', 'manager', or 'admin'), default to standard
 * @return {Promise} Rejects on failure, resolves to the newly created ID on success
 */
export function createUser (fullName, preferredName, email, password, preferredPronouns = '', userType = 'standard') {
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
          .insertOne({
            name: fullName,
            preferredName,
            preferredPronouns,
            email,
            passwordHash,
            userType,

            // Include empty parts of scheme
            contextAlias: {
              avatar: {}
            },
            status: {},
            lastLogin: {},
            teams: [],
            meta: {}
          })
          .then((result) => { return resolve(result.insertedId) })
          .catch((error) => {
            debug('Failed to insert new user')
            debug(error)
            return reject(error)
          })
      })
    })
  })
}
