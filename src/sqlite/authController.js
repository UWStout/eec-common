// Password hashing library
import bcrypt from 'bcrypt'

// Import sqlite helper functions
import { retrieveDBHandle } from './connect.js'
import * as SQLHelp from './sqliteHelper.js'

// How many rounds to use when generating hash salt for passwords
const SALT_ROUNDS = 10

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
 * Validate user credentials
 * @param {string} email The email of the user in the database
 * @param {string} plainPassword Plaintext password
 * @return {Promise} Resolves to object with basic user info, rejects if invalid
 */
export function validateUser (email, password) {
  const userDBHandle = retrieveDBHandle('karunaData', true, true)
  return new Promise((resolve, reject) => {
    userDBHandle.get(
      `SELECT ID, firstName, lastName, userType, passwordHash
        FROM Users WHERE email=$email;`, { $email: email },
      (err, row) => {
        // Check if an error occurred
        if (err) { return reject(err) }

        // Was the user found
        if (!row) { return reject(new Error('Invalid email or password')) }

        // Validate user password
        bcrypt.compare(password, row.passwordHash, (error, valid) => {
          // Check if an error occurred
          if (error) { return reject(error) }

          // Was the password valid
          if (!valid) { return reject(new Error('Invalid email or password')) }

          // Return the email and row data (without password) merged
          row.passwordHash = undefined
          return resolve({ email: email, ...row })
        })
      }
    )
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
        console.error('Failed to hash password')
        console.error(err)
        return reject(err)
      }

      // Make new user data entry
      const userData = {
        $firstName: firstName,
        $lastName: lastName,
        $email: email,
        $type: type,
        $pwHash: passwordHash
      }

      SQLHelp.createEntryAndReturnID('Users',
        `INSERT INTO Users (firstName, lastName, email, userType, passwordHash)
         VALUES ($firstName, $lastName, $email, $type, $pwHash);`,
        userData,
        'SELECT ID FROM Users WHERE email=$email;',
        { $email: email }
      ).then((userID) => {
        return resolve(userID)
      }).catch((err) => {
        return reject(err)
      })
    })
  })
}
