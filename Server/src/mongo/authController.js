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
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Users')
      .findOne({ _id: new ObjectID(userID) })
  })
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
      .findOne({ email: { $exists: true, $eq: email } })
      .then(result => { resolve(result) })
      .catch(() => { resolve(-1) })
  })
}

/**
 * Drop a user from the database
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return DBHandle
    .collection('Users')
    .findOneAndDelete({ _id: new ObjectID(userID) })

  // .then(result => {
  //   if (result.deletedCount !== 1) {
  //     throw 'could not find user with userID of ' + userID
  //   }
  //   return new Promise((resolve, reject) => {
  //   })
  // })
}

/**
 * Validate user credentials
 * @param {string} email The email of the user in the database
 * @param {string} plainPassword Plaintext password
 * @return {Promise} Resolves to object with basic user info, rejects if invalid
 */
export function validateUser (email, password) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  DBHandle
    .collection('Users')
    .findOne({ email: email, plainPassword: password })
    .then(result => {
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
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  DBHandle
    .collection('Users')
    .insertOne({ firstName: firstName, lastName: lastName, email: email, type: type, password: password })
}
