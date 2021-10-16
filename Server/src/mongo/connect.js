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
const clientHandlePromise = MongoDB.MongoClient.connect(
  (process.env.HEROKU ? PROD_SERVER_URL : DB_SERVER_URL),
  { useNewUrlParser: true, useUnifiedTopology: true }
)

/**
 * Ensure there is a connection to the mongoDB instance and optionally return
 * a handle to the given database.
 * @param {string} dbName Name of the database to connect to.
 * @returns {MongoDB.db | null} If a dbName is provided, the database handle will be returned, otherwise null is returned.
 * @throws If connection to mongodb instance fails.
 */
export async function connect (dbName) {
  try {
    // Ensure connection is established
    const clientHandle = await clientHandlePromise

    // Return database handle
    if (dbName) {
      return clientHandle.db(dbName)
    }
  } catch (err) {
    debug('Connection to mongodb failed')
    debug(err)
  }

  return null
}

/**
 * Close all client connections to MongoDB (if not connected, does nothing).
 * @throws If there is an error while closing the connection.
 */
export async function closeClient () {
  let clientHandle = null
  try {
    // Ensure connection is established
    clientHandle = await clientHandlePromise
  } catch (err) {
    debug('Connection to mongodb failed')
    debug(err)
  }

  if (clientHandle !== null) {
    try {
      debug('Disconnecting from mongo ...')
      await clientHandle.close()
      debug('... success')
    } catch (err) {
      debug('Connection to mongodb failed')
      debug(err)
    }
  }
}

/**
 * Get the MongoClient connection promise
 * @returns {Promise<MongoClient>} Resolves to the connected MongoClient on success
 */
export function getClientPromise () {
  return clientHandlePromise
}
