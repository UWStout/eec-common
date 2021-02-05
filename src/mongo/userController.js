import { retrieveDBHandle } from './connect.js'

// To deal with ObjectIDs in the mongo format
import { ObjectID } from 'mongodb'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

/**
 * Retrieve the number of users in the user table
 *
 * tested in test 22 of test.js
 *
 * @return {Promise} Resolves to the number of users, rejects on error
 */
export function getUserCount () {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle.collection('Users').estimatedDocumentCount()
}

/**
 * Retrieve all the details for a given userID
 *
 * tested in test 15 of test.js
 *
 * @param {number} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export function getUserDetails (userID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Users')
    .findOne({ _id: new ObjectID(userID) }, { projection: { passwordHash: 0 } })
}

/**
 * Check if a user already exists for the given email
 *
 * tested in test 2 of test.js
 *
 * @param {string} email ID of the user in the database
 * @return {Promise} Resolves to the userID or -1 if no user exists
 */
export function emailExists (email) {
  const DBHandle = retrieveDBHandle('karunaData')
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
 * List users in the database with pagination, sorting, and filtering. See listCollection()
 * in 'commonHelper.js' for description of all the parameters and return value
 *
 * tested in test 12 of test.js
 *
 * @param {bool} IDsOnly Include only IDs in the results
 */
export function listUsers (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '') {
  let project = null
  let lookup = null
  if (IDsOnly) {
    project = { _id: 1 }
  } else {
    // Build lookup object to merge 'teams' into results
    lookup = {
      $lookup: {
        from: 'Teams',
        localField: 'teams',
        foreignField: '_id',
        as: 'teams'
      }
    }
  }

  return listCollection('Users', lookup, project, perPage, page, sortBy, sortOrder, filterBy, filter)
}

/**
 * List all the users that belong to a certain team.
 *
 * Tested in test 11 of test.js
 *
 * @param {string} teamID ObjectID string of an existing team
 * @returns {Promise} Resolves to list of users on success, rejects with error on failure
 */
export function listUsersInTeam (teamID) {
  // Check for proper TeamID
  if (!teamID) {
    return Promise.reject(new Error('TeamID must be defined'))
  }

  return new Promise((resolve, reject) => {
    // Retrieve team details
    const DBHandle = retrieveDBHandle('karunaData')

    try {
      DBHandle.collection('Teams')
        .findOne({ _id: new ObjectID(teamID) }, (err, result) => {
          // Check for and handle error
          if (err) {
            debug('Error retrieving unit for "listUsersInTeam"')
            debug(err)
            return reject(err)
          }

          // For invalid teamID (does not exist)
          if (!result) { return resolve({ error: true, message: 'Team not found' }) }

          // Reshape unit data (removing id)
          const teamData = {
            teamName: result.name,
            teamAdmin: result.admin,
            teamCulture: result.culture,
            orgId: result.orgId
          }

          // Retrieve filtered list of users with unit info joined
          DBHandle.collection('Users').aggregate([
            { $match: { teams: new ObjectID(teamID) } },
            { $project: { passwordHash: 0, teams: 0 } },
            { $addFields: teamData }
          ], (err, cursor) => {
            // Check for and handle error
            if (err) {
              debug('Error listing teams for "listUsersInTeam"')
              debug(err)
              return reject(err)
            }

            // Convert to array and return
            cursor.toArray((err, docs) => {
              if (err) {
                debug('Cursor toArray failed for "listUsersInTeam"')
                debug(err)
                return reject(err)
              }

              // Resolve with the results
              return resolve(docs)
            })
          })
        })
    } catch (err) {
      return resolve({ error: true, message: err.toString() })
    }
  })
}

/**
 * Update a user entry in the database with new data
 *
 * tested in test 13 of test.js
 *
 * @param {number} userID ID of the user to update
 * @param {Object} newData New data for the user document (will be merged with existing document)
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUser (userID, newData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update user')
            debug(err)
            return reject(err)
          }
          resolve()
        }
      )
  })
}

/**
 * Update a user's recent activity timestamps
 * @param {number} userID ID of the user to update
 * @param {string} remoteAddress New IP address to set as source of the activity.
 * @param {string[]|bool} context Pass 'true' to indicate a wizard login, otherwise, pass array of
 *                                active contexts. If empty or false-ish, will treat as a standard login.
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUserTimestamps (userID, remoteAddress, context) {
  // Ensure userID is defined
  if (!userID) {
    return Promise.reject(new Error('UserId must be defined'))
  }

  // Setup new data for database
  const newData = {}
  if (context === true) {
    // Build last login object for a wizard
    newData.lastWizardLogin = {
      timestamp: new Date(),
      remoteAddress
    }
  } else if (!Array.isArray(context) || context.length === 0) {
    // Build last login object
    newData.lastLogin = {
      timestamp: new Date(),
      remoteAddress
    }
  } else {
    // Build updated context timestamp list
    newData.lastContextLogin = {}
    context.forEach((contextName) => {
      newData.lastContextLogin[contextName] = {
        timestamp: new Date(),
        remoteAddress
      }
    })
  }

  // Update user record with the latest connection/login data
  return new Promise((resolve, reject) => {
    const DBHandle = retrieveDBHandle('karunaData')
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { ...newData } },
        (err, result) => {
          if (err) {
            debug('Failed to update user with login/connect timestamp')
            debug(err)
            return reject(err)
          }
          resolve()
        }
      )
  })
}

/**
 * Update a user's most recently indicated affect
 * @param {number} userID ID of the user to update
 * @param {string} affectID ID of the most recently indicated affect
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function updateUserAffect (userID, affectID) {
  // Ensure userID and affectID are defined
  if (!userID || !affectID) {
    return Promise.reject(new Error('Both the userID and affectID must be defined'))
  }

  // Setup new data for database
  const lastAffect = {
    timestamp: new Date(),
    affectID: new ObjectID(affectID)
  }

  // Update user record with the latest affect data
  return new Promise((resolve, reject) => {
    const DBHandle = retrieveDBHandle('karunaData')
    DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { lastAffect } },
        (err, result) => {
          if (err) {
            debug('Failed to update user with latest affect data')
            debug(err)
            return reject(err)
          }
          resolve()
        }
      )
  })
}

/**
 * Drop a user from the database
 *
 * tested in test 16 of test.js
 *
 * @param {number} userID ID of the user to remove
 * @return {Promise} Resolves with no data if successful, rejects on error
 */
export function removeUser (userID) {
  const DBHandle = retrieveDBHandle('karunaData')
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
 * Retrieves user status object given userID which contains user data for most recent mood, collaboration willingness, time to respond
 *
 * tested in test 33
 *
 * @param {ObjectID} userID
 * @returns {Promise} resolves with status object from user field, else rejects with an error
 */
export function getUserStatus (userID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Users')
    .findOne({ _id: new ObjectID(userID) }, { projection: { status: 1, _id: 0 } })
}

/**
 * updates the user's status. pushes updates to the status object of the user document with the given userID
 *
 * tested in test 34
 *
 * @param {ObjectID} userID the user whose status is being updated
 * @param {ObjectID} lastAffectID can be null, the user's most recent mood
 * @param {String} lastCollaborationStatus can be null, the user's most recent collaboration status
 * @param {String} minutesToRespond can be null? the user's average minutes to respond
 */
export function updateUserStatus (userID, lastAffectID, lastCollaborationStatus, minutesToRespond) {
  const DBHandle = retrieveDBHandle('karunaData')

  return new Promise((resolve, reject) => {
    return DBHandle
      .collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { status: { lastAffectID: new ObjectID(lastAffectID), lastCollaborationStatus, minutesToRespond } } },
        (err, result) => {
          if (err) {
            debug('Failed to update user status')
            debug(err)
            return reject(err)
          }
          resolve()
        })
  })
}
