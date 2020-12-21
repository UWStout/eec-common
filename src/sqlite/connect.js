// Library for managing file paths
import path, { resolve } from 'path'

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

/**
 * Attempt to connect to the given database (asynchronous)
 * @param {string} [dbName] Name of the database to open (defaults to 'datastore')
 * @param {boolean} autoClose Should it setup to auto-close when server stops? (default true)
 * @return {Promise} Resolves to the database handle or null if already connected. Rejects on error.
 */
export function connect (dbName = 'datastore', autoClose = true) {
  // If there an existing connection, just reuse it.
  if (dbHandle[dbName]) {
    return Promise.resolve(dbHandle[dbName])
  }

  return new Promise((resolve, reject) => {
    // Attempt to connect to the database
    console.log(`Connecting to ${dbName} database using sqlite3 ...`)
    const filename = path.join(DB_FILE_PATH, `${dbName}.sqlite3`)
    const db = new sqlite.Database(filename, (err) => {
      // Check for errors
      if (err) {
        // Log error and reject promise
        console.error(`Failed to open ${filename} database (sqlite3)`)
        console.error(err)
        return reject(err)
      } else {
        // Log success and validate the db
        console.log(`${dbName} database connection successful. Validating.`)
        dbHandle[dbName] = db
        confirmSchema(db).then(() => {
          // Setup database to close cleanly before exiting
          if (autoClose) {
            process.on('beforeExit', () => {
              console.log(`Auto-closing ${dbName} ...`)
              close(dbName)
            })
          }

          // Resolve with database handle
          return resolve(db)
        }, (err) => {
          // Log error and reject
          console.error('DB Schema failed to validate.')
          console.error(err)
          reject(err)
        })
      }
    })
  })
}

/**
 * Retrieve a handle to a database that has already been connected to. Note: must call 'connect()' first.
 * @param {string} [dbName] Name of the database to connect to (defaults to 'datastore')
 * @return {object} The SQLite3 database handle for use with queries or null if none exists
 */
export function retrieveDBHandle (dbName = 'datastore') {
  // Is there an existing connection?
  if (dbHandle[dbName]) {
    return dbHandle[dbName]
  }

  // Cannot retrieve handle
  console.error(`No connection to ${dbName} database available.`)
  return null
}

/**
 * Attempt to close a database connection.
 * @param {string} [dbName] Name of database to close (defaults to 'datastore')
 */
export function close (dbName = 'datastore') {
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
 * @return {Promise} Resolves when the schema is done confirming. Rejects on error.
 */
function confirmSchema (db) {
  // Create or confirm the tables in the database
  return new Promise((resolve, reject) => {
    let completeCount = 0
    CREATE_QUERIES.forEach((createSQL, i) => {
      db.run(createSQL, (err) => {
        if (err) {
          console.error(`Error during table ${i} creation`)
          console.error(err)
          return reject(err)
        } else {
          completeCount++
          if (completeCount === CREATE_QUERIES.length) {
            return resolve()
          }
        }
      })
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
    userType TEXT DEFAULT "standard" NOT NULL,
    meta TEXT DEFAULT "{}"
  );`,

  `CREATE TABLE IF NOT EXISTS Affects (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    characterCode TEXT(1) NOT NULL,
    name TEXT NOT NULL,
    description TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS UserAffectHistory (
    userID INTEGER NOT NULL,
    affectID INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    CONSTRAINT UserAffectHistory_PK PRIMARY KEY (userID,affectID,"timestamp"),
    CONSTRAINT UserAffectHistory_User_FK FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT UserAffectHistory_Affect_FK FOREIGN KEY (affectID) REFERENCES Affects(ID) ON DELETE CASCADE ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS Units (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    adminID INTEGER,
    CONSTRAINT Units_Users_FK FOREIGN KEY (adminID) REFERENCES Users(ID) ON DELETE SET NULL ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS Teams (
    ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    unitID INTEGER,
    CONSTRAINT Teams_Units_FK FOREIGN KEY (unitID) REFERENCES Units(ID) ON DELETE SET NULL ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS UsersTeams (
    userID INTEGER NOT NULL,
    teamID INTEGER NOT NULL,
    CONSTRAINT UsersTeams_PK PRIMARY KEY (userID,teamID),
    CONSTRAINT UsersTeams_Users_FK FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT UsersTeams_Teams_FK FOREIGN KEY (teamID) REFERENCES Teams(ID) ON DELETE CASCADE ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS TeamAffectStandards (
    teamID INTEGER NOT NULL,
    affectID INTEGER NOT NULL,
    meaning TEXT NOT NULL,
    meaningDetails TEXT,
    CONSTRAINT TeamAffectStandards_PK PRIMARY KEY (teamID,affectID),
    CONSTRAINT TeamAffectStandards_Teams_FK FOREIGN KEY (teamID) REFERENCES Teams(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT TeamAffectStandards_Affects_FK FOREIGN KEY (affectID) REFERENCES Affects(ID) ON DELETE CASCADE ON UPDATE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS UserTeamAffectHistory (
    userID INTEGER NOT NULL,
    teamID INTEGER NOT NULL,
    affectID INTEGER NOT NULL,
    temestamp INTEGER NOT NULL,
    visibility INTEGER DEFAULT 0 NOT NULL,
    CONSTRAINT UserTeamAffectHistory_PK PRIMARY KEY (userID,teamID,affectID,temestamp),
    CONSTRAINT UserTeamAffectHistory_Users_FK FOREIGN KEY (userID) REFERENCES Users(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT UserTeamAffectHistory_Teams_FK FOREIGN KEY (teamID) REFERENCES Teams(ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT UserTeamAffectHistory_Affects_FK FOREIGN KEY (affectID) REFERENCES Affects(ID) ON DELETE CASCADE ON UPDATE CASCADE
  );`
]
