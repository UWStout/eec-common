// Import sqlite helper functions
import { retrieveDBHandle } from './connect.js'
import * as SQLHelp from './sqliteHelper.js'

/**
 * Retrieve details for the given team
 * @param {number} teamID ID of the team to lookup
 * @return {Promise} Resolves to JS Object with all the team details, rejects on error
 */
export function getTeamDetails (teamID) {
  return SQLHelp.getEntryFromID(teamID, 'Teams')
}

/**
 * Retrieve details for the given organizational unit
 * @param {number} unitID ID of the org unit to lookup
 * @return {Promise} Resolves to JS Object with all the org unit details, rejects on error
 */
export function getOrgUnitDetails (unitID) {
  return SQLHelp.getEntryFromID(unitID, 'Units')
}

/**
 * Create new team and optionally add user to the team.
 * @param {string} teamName Name for the new team
 * @param {number} teamUnitID ID of the related teamUnit (may be empty)
 * @param {number} userID ID of a user to add to the team (may be empty)
 * @return {number} ID of the newly created team or null if creation fails
 */
export function createTeam (teamName, teamUnitID, userID) {
  SQLHelp.createEntryAndReturnID('Teams',
    'INSERT INTO Teams (name, unitID) VALUES ($teamName, $unitID);',
    { $teamName: teamName, $unitID: teamUnitID },
    'SELECT ID FROM Teams WHERE name=$teamName AND unitID=$unitID;',
    { $teamName: teamName, $unitID: teamUnitID }
  ).then((newTeamID) => {
    // Was a userID specified
    if (userID) { addToTeam(userID) }

    // Resolve with the newly created teamID
    return Promise.resolve(newTeamID)
  }).catch((err) => {
    return Promise.reject(err)
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
  return SQLHelp.createEntryAndReturnID('Units',
    'INSERT INTO Units (name, description, adminID) VALUES ($unitName, $description, $adminID);',
    { $unitName: unitName, $unitID: description, $adminID: adminID },
    'SELECT ID FROM Units WHERE name=$unitName;',
    { $unitName: unitName }
  )
}

/**
 * Drop the given team from the database
 * @param {number} teamID ID of the team to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeTeam (teamID) {
  return SQLHelp.deleteEntryFromID(teamID, 'Teams')
}

/**
 * Drop the given organization unit from the database
 * @param {number} unitID ID of the org unit to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeOrgUnit (unitID) {
  return SQLHelp.deleteEntryFromID(unitID, 'Units')
}

/**
 * Get list of teams (ids, units, and names only)
 * @param {number} teamUnitID Optional team unit to filter by (may be combined with user)
 * @param {number} userID Optional user to filter by (may be combined with team unit)
 * @return {[object]} Array of objects containing team ids, names, and unit names that
 *                    match the given filters
 */
export function listTeams (teamUnitID, userID) {
  // Catch cases where not both IDs are defined
  if (!teamUnitID && !userID) {
    return Promise.reject(new Error('Can\'t list teams. At least one of the IDs must be defined.'))
  } else if (!teamUnitID) {
    return listTeamsForUser(userID)
  } else if (!userID) {
    return listTeamsInOrg(teamUnitID)
  }

  // Both IDs are defined
  const teamDBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    teamDBHandle.all(
      `SELECT Teams.ID as teamID, Teams.name as teamName, Unit.name as teamUnit
        FROM Teams
          JOIN UsersTeams ON UsersTeams.teamID = Teams.ID
          JOIN Users on UsersTeams.userID = Users.ID
          JOIN Units on Teams.unitID = Units.ID
        WHERE Users.ID = $userID AND Units.ID = $teamUnitID;`,
      { $userID: userID, $teamUnitID: teamUnitID },
      (err, rows) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error retrieving team list for user ${userID}`)
          console.error(err)
          return reject(err)
        }

        // Resolve with the newly created unitID
        return resolve(rows)
      }
    )
  })
}

export function listTeamsInOrg (teamUnitID) {
  const teamDBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    teamDBHandle.all(
      `SELECT Teams.ID as teamID, Teams.name as teamName, Unit.name as teamUnit
        FROM Teams JOIN Units on Teams.unitID = Units.ID
        WHERE Units.ID = $teamUnitID;`, { $teamUnitID: teamUnitID },
      (err, rows) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error retrieving team list for org unit ${teamUnitID}`)
          console.error(err)
          return reject(err)
        }

        // Resolve with the newly created unitID
        return resolve(rows)
      }
    )
  })
}

export function listTeamsForUser (userID) {
  const teamDBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    teamDBHandle.all(
      `SELECT Teams.ID as teamID, Teams.name as teamName, Unit.name as teamUnit
        FROM Teams
          JOIN UsersTeams ON UsersTeams.teamID = Teams.ID
          JOIN Users on UsersTeams.userID = Users.ID
          JOIN Units on Teams.unitID = Units.ID
        WHERE Users.ID = $userID;`, { $userID: userID },
      (err, rows) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error retrieving team list for user ${userID}`)
          console.error(err)
          return reject(err)
        }

        // Resolve with the newly created unitID
        return resolve(rows)
      }
    )
  })
}

/**
 * Add a user to a given team
 * @param {number} userID The id of the user to add
 * @param {number} teamID The id of the team to add them to
 * @return {Promise} Resolves with 'true' on success, rejects on error
 */
export function addToTeam (userID, teamID) {
  const teamDBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    teamDBHandle.run('INSERT INTO UsersTeams (userID, teamID) VALUES ($userID, $teamID);',
      { $userID: userID, $teamID: teamID }, (err) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error adding user ${userID} to team ${teamID}`)
          console.error(err)
          return reject(err)
        }

        // Resolve positively
        return resolve(true)
      }
    )
  })
}
