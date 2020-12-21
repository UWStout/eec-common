// Import connection helper functions
import { retrieveDBHandle } from './connect.js'

/**
 * Check if a particular value already exists for a field in a given table
 * @param {string} tableName Name of the table to check
 * @param {string} fieldName Name of the column/field to check
 * @param {any} value Value to check for
 * @return {Promise} Resolves to ID if the value is found, -1 if it is not, rejects on error
 */
export function checkValueExistence (tableName, fieldName, value) {
  if (!tableName || !fieldName) {
    return Promise.reject(new Error('Table and field names are required'))
  }

  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    DBHandle.get(`SELECT ID FROM ${tableName} WHERE ${fieldName}=$value`, {
      $value: value
    }, (err, row) => {
      // Check if an error occurred
      if (err) {
        console.error(`Failed while checking if ${value} exists in ${tableName}.${fieldName}`)
        console.error(err)
        return reject(err)
      }

      // Return -1 if not found
      if (!row) {
        return resolve(-1)
      }

      // Return the Matched ID
      return resolve(row.ID)
    })
  })
}

/**
 * Generic function to get full entry from an ID
 * @param {number} ID ID of the entry to retrieve
 * @param {string} tableName Name of the table to query
 * @return {Promise} Resolves to JS object with all entry data, rejects on error
 */
export function getEntryFromID (ID, tableName) {
  // Don't allow empty table names
  if (!tableName) {
    return Promise.reject(new Error('No table name provided'))
  }

  // Asynchronously lookup entry
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    // Lookup the ID of the newly created user
    DBHandle.get(`SELECT * FROM ${tableName} WHERE ID=$ID;`,
      { $ID: ID }, (err, row) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error retrieving details for ID ${ID} in ${tableName}`)
          console.error(err)
          return reject(err)
        }

        // Check if an error occurred
        if (!row) {
          return reject(new Error(`Failed to find ID ${ID} in ${tableName}`))
        }

        // Return the full entry
        return resolve(row)
      }
    )
  })
}

/**
 * Generic function to remove an entry given an ID
 * @param {number} ID ID of the entry to remove
 * @param {string} tableName Name of the table it belongs to
 * @return {Promise} Resolves with 'true' on success, rejects on error
 */
export function deleteEntryFromID (ID, tableName) {
  // Don't allow empty table names
  if (!tableName) {
    return Promise.reject(new Error('No table name provided'))
  }

  // Asynchronously delete entry
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    // Lookup the ID of the newly created user
    DBHandle.run(`DELETE FROM ${tableName} WHERE ID=$ID;`,
      { $ID: ID }, (err) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error removing ID ${ID} from ${tableName}`)
          console.error(err)
          return reject(err)
        }

        // Resolve indicating success
        return resolve(true)
      }
    )
  })
}

export function createEntryAndReturnID (tableName, insertQuery, insertData, IDQuery, IDData) {
  const DBHandle = retrieveDBHandle('karunaData')
  return new Promise((resolve, reject) => {
    // Attempt to insert into DB
    DBHandle.run(insertQuery, insertData, (err) => {
      // Check if an error occurred
      if (err) {
        console.error(`Failed to create new entry in ${tableName}`)
        console.error(err)
        return reject(err)
      }

      // Lookup the ID of the newly created entry
      DBHandle.get(IDQuery, IDData, (err, row) => {
        // Check if an error occurred
        if (err) {
          console.error(`Error querying ID of new entry in ${tableName}`)
          console.error(err)
          return reject(err)
        }

        // Check if an error occurred
        if (!row) {
          return reject(new Error(`Failed to find ID of new entry in ${tableName}`))
        }

        // Resolve with the newly created teamID
        return resolve(row.ID)
      })
    })
  })
}
