// MongoDB communication libraries
// import { ClientEncryption } from 'mongodb-client-encryption'
import { MongoClient } from 'mongodb'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('server:mongo')

// Load .env config
dotenv.config()

// Client and db connection
const dbHandle = []

// URL of the database server
const DB_SERVER_URL = 'mongodb://localhost:27017'
const PROD_SERVER_URL = `mongodb+srv://${process.env.MONGO_USER}@karunacluster1.yb2nw.mongodb.net/karunaData?retryWrites=true&w=majority`

// Initialize database connection
let CONNECTING_PROMISE = null
export async function connect (dbName = 'eec-common', autoClose = true) {
  try {
    // Are we already connecting?
    if (CONNECTING_PROMISE) {
      debug('Already connecting, awaiting result')
      await CONNECTING_PROMISE
      return dbHandle[dbName]
    }
  } catch (err) {
    // Don't log tons as the original connection attempt will do that
    console.error('CRITICAL: MongoDB connection failed')
    return null
  }

  // Is there an existing connection? Using retrieveDBHandle instead.
  if (dbHandle[dbName]) {
    debug(`Connection to ${dbName} already exists (use retrieveDBHandle instead?)`)
    return null
  }

  // Attempt to connect
  try {
    const URL = (process.env.HEROKU ? PROD_SERVER_URL : DB_SERVER_URL)
    debug(`Connecting to '${URL}'`)
    CONNECTING_PROMISE = MongoClient.connect(URL, { useUnifiedTopology: true })
    dbHandle[dbName] = await CONNECTING_PROMISE
    CONNECTING_PROMISE = null
    debug('Connected to database')
  } catch (err) {
    CONNECTING_PROMISE = null
    debug('CRITICAL: Database connection failed')
    debug(err)
    debug(err.stack)
    process.exit(1)
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
export function retrieveDBHandle (dbName = 'eec-common', autoClose = true) {
  // Is there an existing connection?
  if (dbHandle[dbName]) {
    return dbHandle[dbName].db(dbName)
  }

  // Cannot retrieve handle
  console.error(`No connection to ${dbName} database available.`)
  return null
}
