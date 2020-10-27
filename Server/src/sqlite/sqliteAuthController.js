// Password hashing library
import bcrypt from 'bcrypt'

// Import connection helper functions
import { retrieveDBHandle } from './sqliteConnect.js'

// How many rounds to use when generating hash salt for passwords
const SALT_ROUNDS = 10

// Initialize sqlite library and connect to users database
const userDBHandle = retrieveDBHandle('karunaData', true, true)

/**
 * Retrieve all the details for a given userID
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  return new Promise((resolve, reject) => {
    userDBHandle.get('SELECT * FROM Users WHERE ID=$userID', {
      $userID: userID
    }, (err, row) => {
      // Check if an error occurred
      if (err) {
        console.error(`Failed to get details for user ${userID}`)
        console.error(err)
        return reject(err)
      }

      // Was the user found
      if (!row) { return reject(new Error(`User ${userID} not found`)) }

      // Return the row data
      return resolve(row)
    })
  })
}

/**
 * Check if a user already exists for the given email
 * @param {string} email ID of the user in the database
 * @return {Promise} Resolves to the userID or -1 if no user exists
 */
export function emailExists (email) {
  return new Promise((resolve, reject) => {
    userDBHandle.get('SELECT ID FROM Users WHERE email=$email', {
      $email: email
    }, (err, row) => {
      // Check if an error occurred
      if (err) {
        console.error(`Failed to check if ${email} exists`)
        console.error(err)
        return reject(err)
      }

      // Return -1 if not found
      if (!row) {
        return resolve(-1)
      }

      // Return the user ID
      return resolve(row.ID)
    })
  })
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  return new Promise((resolve, reject) => {
    userDBHandle.run('DROP FROM Users WHERE ID=$userID;', {
      $userID: userID
    }, (err) => {
      // Check if an error occurred
      if (err) {
        console.error(`Failed to remove user ${userID}`)
        console.error(err)
        return reject(err)
      }

      // Resolve with no data on success
      return resolve()
    })
  })
}

/**
 * Validate user credentials
 * @param {string} email The email of the user in the database
 * @param {string} plainPassword Plaintext password
 * @return {Promise} Resolves to object with basic user info, rejects if invalid
 */
export function validateUser (email, password) {
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
      if (err) { return reject(err) }

      // Attempt to insert into DB
      userDBHandle.run(
        `INSERT INTO Users (firstName, lastName, email, userType, passwordHash)
        VALUES ($firstName, $lastName, $email, $type, $pwHash);`, {
          $firstName: firstName,
          $lastName: lastName,
          $email: email,
          $type: type,
          $pwHash: passwordHash
        }, (err) => {
          // Check if an error occurred
          if (err) { return reject(err) }

          // Lookup the ID of the newly created user
          userDBHandle.get('SELECT ID FROM Users WHERE email=$email;',
            { $email: email }, (err, row) => {
              // Check if an error occurred
              if (err) { return reject(err) }

              // Check if an error occurred
              if (!row) {
                return reject(new Error(`Failed to find ID of newly created user ${email}`))
              }

              // Resolve with the newly create userID
              return resolve(row.ID)
            }
          )
        }
      )
    })
  })
}
