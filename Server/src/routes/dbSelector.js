// Possible database controllers
import * as SQLITE_DB_AUTH from '../sqlite/authController.js'
import * as MONGO_DB_AUTH from '../mongo/authController.js'

import * as SQLITE_DB_TEAM from '../sqlite/teamController.js'
import * as MONGO_DB_TEAM from '../mongo/teamController.js'

// Create debug output object
import Debug from 'debug'
const debug = Debug('server:db')

// Read database configuration and return matching auth object
export function getDBAuthController () {
  const DB_TYPE = process.env.DB_TYPE || 'sqlite'
  switch (DB_TYPE) {
    default:
    case 'sqlite':
      if (DB_TYPE !== 'sqlite') {
        debug(`Warning: unknown DB_TYPE "${DB_TYPE}". Will fallback to "sqlite".`)
      }
      debug('Using "sqlite" auth database backend')
      return SQLITE_DB_AUTH

    case 'mongo':
      debug('Using "mongodb" auth database backend')
      return MONGO_DB_AUTH
  }
}

// Read database configuration and return matching team object
export function getDBTeamController () {
  const DB_TYPE = process.env.DB_TYPE || 'sqlite'
  switch (DB_TYPE) {
    default:
    case 'sqlite':
      if (DB_TYPE !== 'sqlite') {
        debug(`Warning: unknown DB_TYPE "${DB_TYPE}". Will fallback to "sqlite".`)
      }
      debug('Using "sqlite" team database backend')
      return SQLITE_DB_TEAM

    case 'mongo':
      debug('Using "mongodb" team database backend')
      return MONGO_DB_TEAM
  }
}
