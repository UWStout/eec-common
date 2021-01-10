// Possible SQLite database controllers
import * as SQLITE_CONNECT from '../sqlite/connect.js'
import * as SQLITE_DB_AUTH from '../sqlite/authController.js'
import * as SQLITE_DB_USER from '../sqlite/userController.js'
import * as SQLITE_DB_TEAM from '../sqlite/teamController.js'

// Possible MongoDB controllers
import * as MONGO_CONNECT from '../mongo/connect.js'
import * as MONGO_DB_AUTH from '../mongo/authController.js'
import * as MONGO_DB_USER from '../mongo/userController.js'
import * as MONGO_DB_TEAM from '../mongo/teamController.js'

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
      SQLITE_CONNECT.connect('karunaData')
      return sqliteDB

    case 'mongo':
      MONGO_CONNECT.connect('karunaData')
      return mongoDB
  }
}

// Convenience function for the 'auth' controller
export function getDBAuthController () {
  return getController('auth', SQLITE_DB_AUTH, MONGO_DB_AUTH)
}

// Convenience function for the 'user' controller
export function getDBUserController () {
  return getController('user', SQLITE_DB_USER, MONGO_DB_USER)
}

// Convenience function for the 'team' controller
export function getDBTeamController () {
  return getController('team', SQLITE_DB_TEAM, MONGO_DB_TEAM)
}
