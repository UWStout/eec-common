// Library for managing file paths
import path from 'path'

// Import and initialize sqlite library
import sqlite3 from 'sqlite3'
let sqlite = sqlite3
if (process.argv.find((arg) => { return arg === 'dev' })) {
  sqlite = sqlite3.verbose()
}

// Path to database file
const DB_FILE_PATH = path.join(__dirname, '../db')

// List of active database connections
const dbHandle = []

// Initialize database connection
export function connect (dbName = 'datastore', autoClose = true) {
  // Is there an existing connection? Using retrieveDBHandle instead.
  if (dbHandle[dbName]) {
    console.error(`Connection to ${dbName} already exists (use retrieveDBHandle instead?)`)
    return null
  }

  // Attempt to connect to the database
  console.log(`Connecting to ${dbName} database using sqlite3 ...`)
  const filename = path.join(DB_FILE_PATH, `${dbName}.sqlite3`)
  const db = new sqlite.Database(
    filename, (err) => {
      // Log any errors or success
      if (err) {
        console.error(`Failed to open ${filename} database (sqlite3)`)
        console.error(err)
      } else {
        console.log(`${dbName} database connection successful.`)
        confirmSchema(db)
        dbHandle[dbName] = db
      }
    }
  )

  if (autoClose) {
    // Setup database to close cleanly before exiting
    process.on('beforeExit', () => {
      console.log(`Auto-closing ${dbName} ...`)
      close(dbName)
    })
  }

  // Return the database connection
  return db
}

// Retrieve an existing DB connection (and possibly auto-connect if not found)
export function retrieveDBHandle (dbName = 'datastore', autoConnect = false, autoClose = true) {
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

// Attempt to close an existing database handle
export function close (dbName) {
  // Is there an open database handle to close
  if (!dbHandle[dbName]) {
    console.error(`Can't close ${dbName} database, no connection.`)
    return
  }

  // Close the handle
  console.log(`Closing ${dbName} database ...`)
  dbHandle[dbName].close((err) => {
    if (err) {
      console.err(`Failed to close ${dbName} database`)
      console.error(err)
    } else {
      console.log(`${dbName} database closed successfully.`)
    }
  })

  // Clear the handle
  dbHandle[dbName] = undefined
}

/**
 * This function will create the tables with the proper schema OR
 * confirm that they exist (by name only). Use when the database is
 * new to ensure it has the proper schema.
 * @param {object} db Handle to the SQLite DB to confirm
 */
function confirmSchema (db) {
  // Create or confirm the tables in the database
  CREATE_QUERIES.forEach((createSQL, i) => {
    db.run(createSQL, (err) => {
      if (err) {
        console.error(`Error during table ${i} creation`)
        console.error(err)
      }
    })
  })
}

// SQL to create the initial schema
const CREATE_QUERIES = [
  `CREATE TABLE IF NOT EXISTS Users (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    passwordHash CHAR(64) NOT NULL,
    firstName TEXT,
    lastName TEXT,
    userType TEXT DEFAULT "standard" NOT NULL
  );`,

  `CREATE TABLE IF NOT EXISTS Units (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    adminID INTEGER,
    CONSTRAINT Units_FK FOREIGN KEY (adminID) REFERENCES Users(ID) ON DELETE SET NULL ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS Teams (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unitID INTEGER,
    CONSTRAINT Teams_FK FOREIGN KEY (unitID) REFERENCES Units(ID) ON DELETE SET NULL ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS UsersTeams (
    userID INTEGER NOT NULL,
    teamID INTEGER NOT NULL,
    CONSTRAINT UsersTeams_FK_users FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT UsersTeams_FK_teams FOREIGN KEY (teamID) REFERENCES Teams(ID) ON DELETE CASCADE ON UPDATE CASCADE
  );`
]
