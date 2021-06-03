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
      const user = await DBUser.getUserDetails(userData[i]._id.$oid)
      expect(user).to.deep.include(sanitizeUser(userData[i]))
    }
  })

  // Runs once after ALL tests completed
  after(function () {
    // Close database connection
    DBUser.closeClient()
  })
})

function sanitizeUser (user) {
  // Process all ObjectIDs
  const sanitized = {
    ...user,
    _id: new MongoDB.ObjectID(user._id.$oid),
    teams: user.teams.map((team) => (new MongoDB.ObjectID(team.$oid)))
  }

  if (sanitized.status && sanitized.status.currentAffectID) {
    sanitized.status.currentAffectID = new MongoDB.ObjectID(user.status.currentAffectID.$oid)
  }

  // Remove password hash
  delete sanitized.passwordHash

  // Sanitize all dates
  const fields = ['lastLogin', 'lastWizardLogin']
  fields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field].timestamp = new Date(
        parseInt(user[field].timestamp.$date.$numberLong)
      )
    }
  })

  if (sanitized.lastContextLogin) {
    const contextFields = ['discord', 'msTeams', 'slack']
    contextFields.forEach((field) => {
      if (sanitized.lastContextLogin[field]) {
        sanitized.lastContextLogin[field].timestamp = new Date(
          parseInt(user.lastContextLogin[field].timestamp.$date.$numberLong)
        )
      }
    })
  }

  // Return object for comparison
  return sanitized
}
