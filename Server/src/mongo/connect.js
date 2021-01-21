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

// Client connection
let clientHandle

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
      return clientHandle.db(dbName)
    }
  } catch (err) {
    // Don't log tons as the original connection attempt will do that
    console.error('CRITICAL: MongoDB connection failed')
    return Promise.reject(err)
  }

  // Is there an existing connection? Using retrieveDBHandle instead.
  if (clientHandle) {
    debug('Connection to client already exists (use retrieveDBHandle instead?)')
    return Promise.reject(new Error('Client connection already exists'))
  }

  // Attempt to connect
  try {
    const URL = (process.env.HEROKU ? PROD_SERVER_URL : DB_SERVER_URL)
    console.log(`Connecting to MongoDB at '${URL}'`)
    CONNECTING_PROMISE = MongoClient.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true })
    clientHandle = await CONNECTING_PROMISE
    CONNECTING_PROMISE = null
    console.log('Connected to database')
  } catch (err) {
    CONNECTING_PROMISE = null
    console.error('CRITICAL: Database connection failed')
    console.error(err)
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
  return Promise.resolve(clientHandle.db(dbName))
}

// Attempt to close an existing database handle
export function close (dbName) {
  // Is there an open database handle to close
  if (!clientHandle) {
    console.error('Can\'t close mongoDB client database, no connection.')
    return
  }

  // Close the handle
  console.log('Closing mongoDB database ...')
  clientHandle.close().then(() => {
    // Clear the handle
    clientHandle = undefined
  })
}

// Retrieve an existing DB connection (and possibly auto-connect if not found)
export function retrieveDBHandle (dbName = 'eec-common', autoClose = true) {
  // Is there an existing connection?
  if (clientHandle) {
    return clientHandle.db(dbName)
  }

  // Cannot retrieve handle
  console.error('No mongo client connection available.')
  return null
}
