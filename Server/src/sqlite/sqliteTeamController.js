// Import and initialize sqlite library
import sqlite3 from 'sqlite3'

// Import connection helper functions
import { retrieveDBHandle } from './sqliteConnect.js'

// Initialize sqlite library and connect to users database
const sqlite = sqlite3.verbose()
const userDBHandle = retrieveDBHandle('karunaData', true, true)

/**
 * Retrieve details for the given team
 * @param {number} teamID ID of the team to lookup
 * @return {object} JS Object with all the team and team unit details
 */
export function getTeamDetails (teamID) {

}

/**
 * Create new team and optionally add user to the team.
 * @param {string} teamName Name for the new team
 * @param {number} teamUnitID ID of the related teamUnit (may be empty)
 * @param {number} userID ID of a user to add to the team (may be empty)
 * @return {number} ID of the newly created team or null if creation fails
 */
export function createTeam (teamName, teamUnitID, user) {

}

/**
 * Drop the given team from the database
 * @param {number} teamID ID of the team to destroy (must exist in DB)
 * @return {boolean} Whether or not the removal was successful
 */
export function removeTeam (teamID) {

}

/**
 * Get list of teams (ids, units, and names only)
 * @param {number} teamUnitID Optional team unit to filter by (may be combined with user)
 * @param {number} userID Optional user to filter by (may be combined with team unit)
 * @return {[object]} Array of objects containing team ids, names, and unit names that
 *                    match the given filters
 */
export function listTeams (teamUnitID, userID) {

}

/**
 * Add a user to a given team
 * @param {number} userID The id of the user to add
 * @param {number} teamID The id of the team to add them too
 * @return {boolean} Whether or not the add succeeded
 */
export function addToTeam (user, teamID) {

}
