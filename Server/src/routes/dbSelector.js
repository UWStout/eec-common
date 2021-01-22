// WARNING: SQLite support has been deprecated
// Possible SQLite database controllers
// import * as SQLITE_CONNECT from '../sqlite/connect.js'
// import * as SQLITE_DB_AUTH from '../sqlite/authController.js'
// import * as SQLITE_DB_USER from '../sqlite/userController.js'
// import * as SQLITE_DB_TEAM from '../sqlite/teamController.js'
// import * as SQLITE_DB_ORG_UNIT from '../sqlite/unitController.js'

// Possible MongoDB controllers
import * as MONGO_CONNECT from '../mongo/connect.js'
import * as MONGO_DB_AUTH from '../mongo/authController.js'
import * as MONGO_DB_USER from '../mongo/userController.js'
import * as MONGO_DB_TEAM from '../mongo/teamController.js'
import * as MONGO_DB_ORG_UNIT from '../mongo/unitController.js'
import * as MONGO_DB_LOGS from '../mongo/LogController.js'
import * as MONGO_DB_AFFECT from '../mongo/affectController.js'
import * as MONGO_DB_AFFECT_HISTORY from '../mongo/affectHistoryController.js'

// Debug output
import Debug from 'debug'

// Load variables into process.env and read extra environment variables from the .env file
import dotenv from 'dotenv'
dotenv.config()

// Create debug output object
const debug = Debug('server:db')

// Read database configuration and return matching controller object
function getController (name, sqliteDB, mongoDB) {
  const DB_TYPE = process.env.DB_TYPE || 'sqlite'
  switch (DB_TYPE) {
    default:
    case 'sqlite':
      if (DB_TYPE !== 'sqlite') {
        debug(`Warning: unknown DB_TYPE "${DB_TYPE}". Will fallback to "sqlite".`)
      }
      console.error('SQLITE is no longer supported')
      // SQLITE_CONNECT.connect(name)
      return sqliteDB

    case 'mongo':
      MONGO_CONNECT.connect(name)
      return mongoDB
  }
}

// Convenience function for the 'auth' controller
export function getDBAuthController () {
  return getController('karunaData', null, MONGO_DB_AUTH)
}

// Convenience function for the 'user' controller
export function getDBUserController () {
  return getController('karunaData', null, MONGO_DB_USER)
}

// Convenience function for the 'team' controller
export function getDBTeamController () {
  return getController('karunaData', null, MONGO_DB_TEAM)
}

// Convenience function for the 'unit' controller
export function getDBUnitController () {
  return getController('karunaData', null, MONGO_DB_ORG_UNIT)
}

// Convenience function for the 'karunaLog' controller
export function getDBLogController () {
  return getController('karunaLogs', null, MONGO_DB_LOGS)
}

// Convenience function for the 'affect' controller
export function getDBAffectController () {
  return getController('karunaData', null, MONGO_DB_AFFECT)
}

// Convenience function for the 'affect history' controller
export function getDBAffectHistoryController () {
  return getController('karunaData', null, MONGO_DB_AFFECT_HISTORY)
}
