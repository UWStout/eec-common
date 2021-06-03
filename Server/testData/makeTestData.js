// File IO
import fs from 'fs'

// MongoDB library
import MongoDB from 'mongodb'

// Password hashing library
import bcrypt from 'bcrypt'

// Our own database helper functions
import * as DBHelp from './dbHelper.js'

const { ObjectID } = MongoDB.ObjectID

// Helper function for hashing a password
const SALT_ROUNDS = 10
function hashPassword (password) {
  return new Promise((resolve, reject) => {
    // Hash password
    bcrypt.hash(password, SALT_ROUNDS, (err, passwordHash) => {
      // Check if an error occurred
      if (err) { return reject(err) }

      // Return hashed password
      return resolve(passwordHash)
    })
  })
}

// Main function
;(async () => {
  try {
    // Connect to database
    const DB = await DBHelp.connectDB()
    const DBHandle = DB.db('karunaData')

    // Parse orgs
    const rawOrgStr = fs.readFileSync('./rawOrgsAndTeams/testOrgs.json', { encoding: 'utf8' })
    const rawOrgs = JSON.parse(rawOrgStr)

    // Insert orgs
    await DBHelp.clearCollection(DBHandle, 'Units')
    const orgIDs = await DBHelp.insertAllInCollection(DBHandle, 'Units', rawOrgs)

    // Parse teams
    const rawTeamStr = fs.readFileSync('./rawOrgsAndTeams/testTeams.json', { encoding: 'utf8' })
    let rawTeams = JSON.parse(rawTeamStr)

    // Decorate with random org IDs (~10% will remain null)
    rawTeams = rawTeams.map((team, i) => {
      const randOrgId = new ObjectID(orgIDs[Math.floor(Math.random() * rawOrgs.length)])
      return {
        name: team.name,
        orgId: (Math.random() < 0.1 ? null : randOrgId)
      }
    })

    // Insert teams
    await DBHelp.clearCollection(DBHandle, 'Teams')
    const teamIDs = await DBHelp.insertAllInCollection(DBHandle, 'Teams', rawTeams)

    // Parse and re-structure users
    const rawUsers = []
    process.stdout.write('\nProcessing users ')
    for (let pageIter = 0; pageIter < 20; pageIter++) {
      // Read in and parse next page of users
      const userPageStr = fs.readFileSync(`./rawUsers/usersPage${pageIter + 1}.json`, { encoding: 'utf8' })
      const userPage = JSON.parse(userPageStr).results

      // Organize user object
      for (let userIter = 0; userIter < userPage.length; userIter++) {
        // Get user object
        const user = userPage[userIter]

        // Build team-list
        const teamStrings = []
        for (let idIter = 0; idIter < pageIter; idIter++) {
          let randomID = ''
          do {
            randomID = teamIDs[Math.floor(Math.random() * rawTeams.length)]
          } while (teamStrings.indexOf(randomID) >= 0)
          teamStrings.push(randomID)
        }
        const teams = teamStrings.map((teamStr) => { return new ObjectID(teamStr) })

        // Hash password
        const passwordHash = await hashPassword(user.login.password)

        // Return proper user
        rawUsers.push({
          email: user.email,
          passwordHash,
          firstName: user.name.first,
          lastName: user.name.last,
          userType: 'standard',
          meta: {},
          teams
        })
      }

      // Output progress
      process.stdout.write('.')
    }
    process.stdout.write(' done\n\n')

    // Insert users
    await DBHelp.clearCollection(DBHandle, 'Users')
    await DBHelp.insertAllInCollection(DBHandle, 'Users', rawUsers)

    // Close connection
    await DBHelp.closeDB(DB)
  } catch (err) {
    console.error(err)
  }
})()
