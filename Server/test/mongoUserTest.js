/**
 * Documentation
 * - mocha: https://mochajs.org/
 * - chai: https://www.chaijs.com/api/bdd/
 */

// File and path access
import path from 'path'
import fs from 'fs'

// Database controller
import * as DBUser from '../src/mongo/userController.js'

// Database helper
import MongoDB from 'mongodb'

// Setup the chai assertion library
import { expect } from 'chai'

// Mocha function
describe('user controller test', function () {
  // 'this' is current instance of Mocha
  let userData = []

  // Runs once before the tests
  before(function () {
    // Read in and parse the exported user data
    const rawUserData = fs.readFileSync(path.resolve('./test/data/Users.json'), { encoding: 'utf8' })
    userData = JSON.parse(rawUserData)
  })

  // Test user retrieval
  it('retrieves and verifies users', async function () {
    for (let i = 0; i < userData.length; i++) {
      // Retrieve user info from the database
      const user = await DBUser.getUserDetails(userData[i]._id.$oid)

      // Sanitize the comparison object
      const compare = sanitizeMongoJSON(userData[i])
      delete compare.passwordHash

      // Compare the two
      expect(user).to.deep.include(compare)
    }
  })

  // Runs once after ALL tests completed
  after(function () {
    // Close database connection
    DBUser.closeClient()
  })
})

function sanitizeMongoJSON (user) {
  // Keep track of objects we've seen to avoid cyclic recursion
  const seenObjects = []

  // Inner function to recursively search for objects
  function sanitizeDatesAndOIds (object) {
    // Base case: convert $oid and $date to proper objects
    if (object.$oid) { return new MongoDB.ObjectID(object.$oid) }
    if (object.$date) { return new Date(object.$date) }

    // Descend into any children objects
    for (const k in object) {
      if (typeof object[k] === 'object' && seenObjects.indexOf(object[k]) === -1) {
        object[k] = sanitizeDatesAndOIds(object[k])
        seenObjects.push(object[k])
      }
    }

    // Return the sanitized object
    return object
  }

  // Return object for comparison
  return sanitizeDatesAndOIds({ ...user })
}
