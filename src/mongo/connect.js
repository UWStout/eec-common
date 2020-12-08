// MongoDB communication libraries
// import { ClientEncryption } from 'mongodb-client-encryption'
import { MongoClient } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

// Client and db connection
const dbHandle = []

// URL of the database server
const DB_SERVER_URL = 'mongodb://localhost:27017'

// Initialize database connection
export async function connect (dbName = 'eec-common', autoClose = true) {
  // Is there an existing connection? Using retrieveDBHandle instead.
  if (dbHandle[dbName]) {
    debug(`Connection to ${dbName} already exists (use retrieveDBHandle instead?)`)
    return null
  }

  // Attempt to connect
  try {
    dbHandle[dbName] = await MongoClient.connect(DB_SERVER_URL)
    debug('Connected to database')
  } catch (err) {
    debug('Database connection failed')
    debug(err.stack)
    return null
  }

  // Setup database to close cleanly before exiting
  if (autoClose) {
    process.on('beforeExit', () => {
      console.log(`Auto-closing ${dbName} ...`)
      close(dbName)
    })
  }

  // Return the database connection
  return dbHandle[dbName]
}

// Attempt to close an existing database handle
export function close (dbName) {
  // Is there an open database handle to close
  if (!dbHandle[dbName]) {
    console.error(`Can't close ${dbName} database, no connection.`)
    return
  }

  // Close the handle
  console.log(`Closing ${dbName} database ...`)
  dbHandle[dbName].close().then(() => {
    // Clear the handle
    dbHandle[dbName] = undefined
  })
}

// Retrieve an existing DB connection (and possibly auto-connect if not found)
export function retrieveDBHandle (dbName = 'eec-common', autoConnect = false, autoClose = true) {
  // Is there an existing connection?
  if (dbHandle[dbName]) {
    return dbHandle[dbName]
  }

  // Can we connect if not already connect?
  if (autoConnect) {
    return connect(dbName, autoClose)
  }

  // Cannot retrieve handle
  console.error(`No connection to ${dbName} database available.`)
  return null
}
