// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// To deal with ObjectIDs in the mongo format
import MongoDB from 'mongodb'

// Shared functions between different controllers
import { listCollection } from './commonHelper.js'

// print messages only during debug
import Debug from 'debug'

// Re-export closeClient
export { closeClient }

// Extract ObjectID for easy usage
const { ObjectID } = MongoDB

const debug = Debug('karuna:mongo:userController')

/**
 * Retrieve the number of users in the user table
 *
 * tested in test 22 of test.js
 *
 * @return {Promise} Resolves to the number of users, rejects on error
 */
export async function getUserCount () {
  const DBHandle = await retrieveDBHandle('karunaData')
  return DBHandle.collection('Users').estimatedDocumentCount()
}

/**
 * Retrieve all the details for a given userID
 *
 * tested in test 15 of test.js
 *
 * @param {string} userID ID of the user in the database
 * @return {Promise} Resolves to an object with all the user data, rejects on error
 */
export async function getUserDetails (userID) {
  const DBHandle = await retrieveDBHandle('karunaData')
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
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
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
    retrieveDBHandle('karunaData').then((DBHandle) => {
      try {
        DBHandle.collection('Teams').findOne({ _id: new ObjectID(teamID) }, (err, result) => {
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

          // Retrieve filtered list of users (w/o sensitive info) with team info joined
          DBHandle.collection('Users').aggregate([
            { $match: { teams: new ObjectID(teamID) } },
            {
              $project: {
                passwordHash: 0,
                lastLogin: 0,
                lastContextLogin: 0,
                lastWizardLogin: 0,
                teams: 0,
                meta: 0,
                'status.privateAffectID': 0,
                'status.currentAffectPrivacy': 0
              }
            },
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
  })
}

// /**
//  * List all the current user affects that belong to a certain team.
//  *
//  * @param {string} teamID ObjectID string of an existing team
//  * @returns {Promise} Resolves to array of affect id strings on success, rejects with error on failure
//  */
// export function listUserAffectsInTeam (teamID) {
//   // Check for proper TeamID
//   if (!teamID) {
//     return Promise.reject(new Error('TeamID must be defined'))
//   }

//   return new Promise((resolve, reject) => {
//     // Retrieve team details
//     retrieveDBHandle('karunaData').then((DBHandle) => {
//       try {
//         DBHandle.collection('Teams').findOne({ _id: new ObjectID(teamID) }, (err, result) => {
//           // Check for and handle error
//           if (err) {
//             debug('Error retrieving team for "listUserAffectsInTeam"')
//             debug(err)
//             return reject(err)
//           }

//           // For invalid teamID (does not exist)
//           if (!result) { return resolve({ error: true, message: 'Team not found' }) }

//           // Retrieve filtered list of users (w/o sensitive info) with team info joined
//           DBHandle.collection('Users').aggregate([
//             { $match: { teams: new ObjectID(teamID) } },
//             {
//               $project: {
//                 _id: 0,
//                 affectID: '$status.currentAffectID'
//               }
//             }
//           ], (err, cursor) => {
//             // Check for and handle error
//             if (err) {
//               debug('Error listing teams for "listUserAffectsInTeam"')
//               debug(err)
//               return reject(err)
//             }

//             // Convert to array and return
//             cursor.map((affect) => (affect.affectID)).toArray((err, docs) => {
//               if (err) {
//                 debug('Cursor toArray failed for "listUserAffectsInTeam"')
//                 debug(err)
//                 return reject(err)
//               }
//               // Resolve with the results
//               return resolve(docs)
//             })
//           })
//         })
//       } catch (err) {
//         return resolve({ error: true, message: err.toString() })
//       }
//     })
//   })
// }

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
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
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
  })
}

/**
 * Update a user's recent activity timestamps
 *
 * tested in test 35
 *
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
    context.forEach((contextName) => {
      newData[`lastContextLogin.${contextName}`] = {
        timestamp: new Date(),
        remoteAddress
      }
    })
  }

  // Update user record with the latest connection/login data
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users').findOneAndUpdate(
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
  })
}

export function setUserAlias (userID, contextStr, alias) {
  if (!userID || !contextStr || !alias) {
    return Promise.reject(new Error('All parameters must be defined to set a user alias'))
  }

  // Build the alias document
  const newAlias = {}
  newAlias[`contextAlias.${contextStr}`] = alias

  // Update user record with the new/updated alias data
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users').findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: newAlias },
        (err, result) => {
          if (err) {
            debug(`Failed to update user alias to "${alias}" for "${contextStr}"`)
            debug(err)
            return reject(err)
          }
          return resolve()
        }
      )
    })
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
  return new Promise((resolve, reject) => {
    retrieveDBHandle('karunaData').then((DBHandle) => {
      DBHandle.collection('Users')
        .findOneAndDelete({ _id: new ObjectID(userID) })
        .then(result => { resolve() })
        .catch(error => {
          debug('Failed to remove user')
          debug(error)
          return reject(error)
        })
    })
  })
}

/**
 * Retrieves user status object given userID which contains user data for most recent mood, collaboration willingness, time to respond
 *
 * tested in test 33
 *
 * @param {ObjectID} userID Database ID of the user to retrieve
 * @param {boolean} privileged Include private info (should only be true when retrieving one's own status)
 * @returns {Promise} resolves with status object from user field, else rejects with an error
 */
export async function getUserStatus (userID, privileged = false) {
  const projection = {
    _id: 0,
    'status.currentAffectID': 1,
    'status.collaboration': 1,
    'status.timeToRespond': 1
  }

  if (privileged) {
    projection['status.currentAffectPrivacy'] = 1
    projection['status.privateAffectID'] = 1
  }

  const DBHandle = await retrieveDBHandle('karunaData')
  return DBHandle.collection('Users')
    .findOne(
      { _id: new ObjectID(userID) },
      { projection }
    )
}

/**
 * updates the user's collaboration status. pushes updates to the status object of the user document with the given userID
 *
 * tested in test 34
 *
 * @param {ObjectID} userID the user whose status is being updated
 * @param {String} collaborationStatus can be null, the user's most recent collaboration status
 */
export async function updateUserCollaboration (userID, collaborationStatus) {
  const DBHandle = await retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    return DBHandle.collection('Users').findOneAndUpdate(
      { _id: new ObjectID(userID) },
      { $set: { 'status.collaboration': collaborationStatus } },
      (err, result) => {
        if (err) {
          debug('Failed to update user collaboration status')
          debug(err)
          return reject(err)
        }
        resolve(result)
      }
    )
  })
}

/**
 * updates the user's collaboration status. pushes updates to the status object of the user document with the given userID
 *
 * tested in test 34
 *
 * @param {ObjectID} userID the user whose status is being updated
 * @param {number} time the user's time to respond to queries in minutes (or NaN if undefined)
 * @param {string} units 'm', 'h', or 'd' for units
 * @param {boolean} automatic Whether or not we should automatically compute TTR
 */
export async function updateUserTimeToRespond (userID, time, units, automatic) {
  // Set to default values
  if (typeof time !== 'number') { time = -1 }
  if (typeof units !== 'string') { units = 'm' }
  if (typeof automatic !== 'boolean') { time = false }

  const DBHandle = await retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    return DBHandle.collection('Users')
      .findOneAndUpdate(
        { _id: new ObjectID(userID) },
        { $set: { 'status.timeToRespond': { time, units, automatic } } },
        (err, result) => {
          if (err) {
            debug('Failed to update user time to respond')
            debug(err)
            return reject(err)
          }
          return resolve(result)
        }
      )
  })
}
