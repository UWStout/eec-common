import { retrieveDBHandle } from './connect.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

/**
 * Retrieve details for the given team
 * @param {number} teamID ID of the team to lookup
 * @return {Promise} Resolves to JS Object with all the team details, rejects on error
 */
export function getTeamDetails (teamID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Teams')
    .findOne({ _id: new ObjectID(teamID) })
}

/**
 * Retrieve details for the given organizational unit
 * @param {number} unitID ID of the org unit to lookup
 * @return {Promise} Resolves to JS Object with all the org unit details, rejects on error
 */
export function getOrgUnitDetails (unitID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Units')
    .findOne({ _id: new ObjectID(unitID) })
}

/**
 * Create new team and optionally add user to the team.
 * @param {string} teamName Name for the new team
 * @param {number} unitID ID of the related unit (may be empty)
 * @param {number} userID ID of a user to add to the team (may be empty)
 * @return {number} ID of the newly created team or null if creation fails
 */
export function createTeam (teamName, unitID, userID) {
  const DBHandle = retrieveDBHandle('karunaData')

  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Teams')
      .insertOne({ teamName, unitID: new ObjectID(unitID) }, (err, result) => {
        if (err) {
          debug('Failed to create team')
          debug(err)
          return reject(err)
        } else {
          if (userID) { addToTeam(userID) }
          return resolve(result)
        }
      })
  })
}

/**
 * Create new organization unit (teams are housed under units)
 * @param {string} unitName Name for the new org unit
 * @param {string} description Description of the org unit (may be null)
 * @param {string} adminID ID of admin user (may be null)
 * @return {Promise} Resolves to ID of the newly created org unit, rejects if creation fails
 */
export function createOrgUnit (unitName, description, adminID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Units')
    .insertOne({ unitName, description, adminID: new ObjectID(adminID) })
}

/**
 * Drop the given team from the database
 * @param {number} teamID ID of the team to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeTeam (teamID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Teams')
      .findOneAndDelete({ _id: new ObjectID(teamID) })
      .then(result => { resolve(true) })
      .catch(() => { resolve(false) })
  })
}

/**
 * Drop the given organization unit from the database
 * @param {number} unitID ID of the org unit to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeOrgUnit (unitID) {
  // TODO: Do something with all teams in that org unit
  // What could we do?
  // - Only remove an org if all teams are already deleted
  // - Set the 'unitID' to null in all teams of that unit
  // - Automatically delete all teams in the unit

  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Units')
      .findOneAndDelete({ _id: new ObjectID(unitID) })
      .then(result => { resolve(true) })
      .catch(() => { resolve(false) })
  })
}

/**
 * Get list of teams (ids, units, and names only)
 * @param {number} unitID Optional team unit to filter by (may be combined with user)
 * @param {number} userID Optional user to filter by (may be combined with team unit)
 * @return {[object]} Array of objects containing team ids, names, and unit names that
 *                    match the given filters
 */
export function listTeams (unitID, userID) {
  // Which ID was defined
  if (unitID) {
    return listTeamsInUnit(unitID)
  } else if (userID) {
    return listTeamsForUser(userID)
  }

  // Neither ID was defined
  const err = new Error('Can\'t list teams. At least one of the IDs must be defined.')
  debug(err)
  return Promise.reject(err)
}

/**
 * Return a list of all the teams under a given unit
 * @param {string} unitID Hashed ObjectID for the unit to list
 */
export function listTeamsInUnit (unitID) {
  const DBHandle = retrieveDBHandle('karunaData')
  return DBHandle
    .collection('Teams')
    .findAll({ unitID: new ObjectID(unitID) })
}

/**
 * Return a list of all the teams a particular user belongs to
 * @param {string} userID Hashed ObjectID for the user to list
 */
export function listTeamsForUser (userID) {
  return new Promise((resolve, reject) => {
    // Get database handle
    const DBHandle = retrieveDBHandle('karunaData')

    // Lookup the user
    const userPromise = DBHandle
      .collection('Users')
      .findOne({ _id: new ObjectID(userID) })
      .catch((err) => { return reject(err) })

    userPromise.then((result) => {
      return resolve(result.value.teams)
    })
  })
}

/**
 * Add a user to a given team
 * @param {number} userID The id of the user to add
 * @param {number} teamID The id of the team to add them too
 * @return {Promise} Resolves with 'true' on success, rejects on error
 */
export function addToTeam (userID, teamID) {
  return new Promise((resolve, reject) => {
    // Get database handle
    const DBHandle = retrieveDBHandle('karunaData')

    // Update user record to include indicated team
    DBHandle.collection('Users')
      .update(
        { _id: new ObjectID(userID) },
        { $push: { $teams: new ObjectID(teamID) } }
      ).then((result) => { return resolve(result) })
      .catch((err) => { return reject(err) })
  })
}
