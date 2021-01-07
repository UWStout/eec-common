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
  const DBHandle = retrieveDBHandle('karunaData', true, true)
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
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  return DBHandle
    .collection('Units')
    .findOne({ _id: new ObjectID(unitID) })
}

/**
 * Create new team and optionally add user to the team.
 * @param {string} teamName Name for the new team
 * @param {number} teamUnitID ID of the related teamUnit (may be empty)
 * @param {number} userID ID of a user to add to the team (may be empty)
 * @return {number} ID of the newly created team or null if creation fails
 */
export function createTeam (teamName, teamUnitID, userID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)

  return new Promise((resolve, reject) => {
    DBHandle
      .collection('Teams')
      .insertOne({ teamName, teamUnitID }, (err, result) => {
        if (err) {
          return reject(err)
        } else if (userID) { addToTeam(userID) }

        return resolve(result)
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
  const DBHandle = retrieveDBHandle('karunaData', true, true)
  // TODO: hash the password with bcrypt (see sqlite version)

  return DBHandle
    .collection('Units')
    .insertOne({ unitName, description, adminID })
}

/**
 * Drop the given team from the database
 * @param {number} teamID ID of the team to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeTeam (teamID) {
  const DBHandle = retrieveDBHandle('karunaData', true, true)
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
  const DBHandle = retrieveDBHandle('karunaData', true, true)
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
 * @param {number} teamUnitID Optional team unit to filter by (may be combined with user)
 * @param {number} userID Optional user to filter by (may be combined with team unit)
 * @return {[object]} Array of objects containing team ids, names, and unit names that
 *                    match the given filters
 */
export function listTeams (teamUnitID, userID) {
  if (!teamUnitID && !userID) {
    return Promise.reject(new Error('Can\'t list teams. At least one of the IDs must be defined.'))
  } else if (!teamUnitID) {
    return listTeamsForUser(userID)
  } else if (!userID) {
    return listTeamsInOrg(teamUnitID)
  }
}

export function listTeamsInOrg (teamUnitID) {
  // TODO
}

export function listTeamsForUser (userID) {
  // TODO
}

/**
 * Add a user to a given team
 * @param {number} userID The id of the user to add
 * @param {number} teamID The id of the team to add them too
 * @return {Promise} Resolves with 'true' on success, rejects on error
 */
export function addToTeam (userID, teamID) {
  // TODO
}
