// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

import MongoDB from 'mongodb'

// Password hashing library
import bcrypt from 'bcrypt'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

const debug = Debug('karuna:mongo:authController')

// Extract ObjectID class for easy of use
const { ObjectID } = MongoDB

// How many rounds to use when generating hash salt for passwords
const SALT_ROUNDS = 10

// Setup default team list for any users
// NOTE: This currently includes the 'Kruna test team'
const DEFAULT_TEAMS = [new ObjectID('611e80ee4797c4ac202471ae')]

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
      DBHandle.collection('Users').createIndex(
        { email: 1 },
        { collation: { locale: 'en', strength: 2 } },
        (err, result) => {
          // Check for an error
          if (err || !result) {
            if (err) { debug(err) }
            return reject(new Error('Collated Index failed'))
          }

          // Find user with matching email (leave out teams and meta in returned document)
          DBHandle.collection('Users').findOne({ email }, {
            collation: { locale: 'en', strength: 2 },
            projection: { meta: 0 }
          }, (err, result) => {
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
                userType: result.userType

                // NOTE: This is a LOT to store in the token, consider alternative?
                // activeTeam: (result?.teams?.length > 0 ? result.teams[0] : ''),
                // contextAlias: result.contextAlias
              })
            })
          })
        }
      )
    })
  })
}

/**
 * Create a new user in the database
 * tested in test 3 of test.js
 * @param {string} fullName Full real name of the user to create
 * @param {string} preferredName Nickname or preferred name of the user to create
 * @param {string} email email of the user to create (CHECK FOR CASE-INSENSITIVE UNIQUENESS BEFORE CALLING)
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
            contextId: {},
            contextAlias: {},
            contextAvatar: {},
            status: {},
            lastLogin: {},
            teams: DEFAULT_TEAMS,
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

/**
 * Update an existing user's password
 *
 * @param {string} userID Database id for the user to update password
 * @param {string} token The token generated during the reset request (must match one stored in DB)
 * @param {string} password Plaintext password
 * @return {Promise} Rejects on errors, resolves to true or false depending on result
 */
export function updatePassword (userID, token, password) {
  return new Promise((resolve, reject) => {
    // First lookup user details
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users').findOne(
        { _id: new ObjectID(userID) },
        (err, userInfo) => {
          // check for errors
          if (err) {
            debug(`Failed to find user ${userID}`)
            return reject(err)
          }

          // Check that the token matches and is the right type
          if (userInfo?.lastEmail?.token !== token || userInfo?.lastEmail?.type !== 'recovery') {
            debug('Tokens do not match')
            return resolve(false)
          }

          // Hash password and update
          bcrypt.hash(password, SALT_ROUNDS, (err, passwordHash) => {
            // Check if an error occurred
            if (err) {
              debug('Failed to hash password')
              debug(err)
              return reject(err)
            }

            // Setup new password and clear token so it can't be reused
            const newData = { passwordHash }
            const unsetData = {}
            unsetData['lastEmail.token'] = ''
            unsetData['lastEmail.type'] = ''

            // Update the password and clear the token
            DBHandle.collection('Users').findOneAndUpdate(
              { _id: new ObjectID(userID) },
              { $set: newData, $unset: unsetData },
              (err, result) => {
                if (err) {
                  debug('Failed to update password')
                  debug(err)
                  return reject(err)
                }
                return resolve(true)
              }
            )
          })
        }
      )
    })
  })
}

/**
 * Update an existing user's password
 *
 * @param {string} userID Database id for the user to update password
 * @param {string} token The token sent in the validation email (must match one stored in DB)
 * @return {Promise} Rejects on errors, resolves to true or false depending on result
 */
export function validateEmail (userID, token, password) {
  return new Promise((resolve, reject) => {
    // First lookup user details
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users').findOne(
        { _id: new ObjectID(userID) },
        (err, userInfo) => {
          // Check for errors
          if (err) {
            debug(`Failed to find user ${userID}`)
            return reject(err)
          }

          // Check that the token matches and is the right type
          if (userInfo?.lastEmail?.token !== token || userInfo?.lastEmail?.type !== 'verify') {
            debug('Tokens do not match')
            return resolve(false)
          }

          // Setup new password and clear token so it can't be reused
          const newData = { emailVerified: true }
          const unsetData = {}
          unsetData['lastEmail.token'] = ''
          unsetData['lastEmail.type'] = ''

          // Update email verification and clear token
          DBHandle.collection('Users').findOneAndUpdate(
            { _id: new ObjectID(userID) },
            { $set: newData, $unset: unsetData },
            (err, result) => {
              if (err) {
                debug('Failed to verify email')
                debug(err)
                return reject(err)
              }
              return resolve(true)
            }
          )
        }
      )
    })
  })
}
