// MongoDB communication libraries
// import { ClientEncryption } from 'mongodb-client-encryption'
import MongoDB from 'mongodb'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('karuna:mongo:connect')

// Load .env config
dotenv.config()

// URL of the database server
const DB_SERVER_URL = 'mongodb://localhost:27017'
const PROD_SERVER_URL = `mongodb+srv://${process.env.MONGO_USER}@karunacluster1.yb2nw.mongodb.net/karunaData?retryWrites=true&w=majority`

// Client connection handle
const clientHandle = new MongoDB.MongoClient(
  (process.env.HEROKU ? PROD_SERVER_URL : DB_SERVER_URL),
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// Promise that resolves once connection is active
let connectPromise = null

/**
 * Ensure there is a connection to the mongoDB instance and optionally return
 * a handle to the given database.
 * @param {string} dbName Name of the database to connect to.
 * @returns {MongoDB.db | undefined} If a dbName is provided, the database handle will be returned, otherwise null is returned.
 * @throws If connection to mongodb instance fails.
 */
export async function connect (dbName) {
  // Make sure we're connected (does nothing if already connected)
  try {
    if (connectPromise !== null) {
      await connectPromise
    } else {
      connectPromise = clientHandle.connect()
      await connectPromise
      connectPromise = null
    }
  } catch (err) {
    debug('Failed to connect to mongodb')
    debug(err)
    throw new Error('Failed to connect to mongodb')
  }

  // Return database handle
  if (dbName) {
    return clientHandle.db(dbName)
  }
}

/**
 * Close all client connections to MongoDB (if not connected, does nothing).
 * @throws If there is an error while closing the connection.
 */
export async function closeClient () {
  // Establish a connection (if not already)
  try {
    debug('Disconnecting from mongo ...')
    await clientHandle.close()
    debug('... success')
  } catch (err) {
    debug('Error disconnecting from mongo', err)
    throw (new Error('Failed to disconnect from mongodb'))
  }
}
