// File IO
import fs from 'fs'

// UUID Generator
import { v4 as UUIDv4 } from 'uuid'

// MongoDB library
import MongoDB from 'mongodb'

// Password hashing library
import bcrypt from 'bcrypt'

// Filler generator
import { LoremIpsum } from 'lorem-ipsum'

// Our own database helper functions
import * as DBHelp from './dbHelper.js'

// Filler generation object
const lorem = new LoremIpsum({
  sentencesPerParagraph: { max: 8, min: 4 },
  wordsPerSentence: { max: 16, min: 4 }
})

// Just some common pronoun lists (not by any means comprehensive)
const PRONOUNS = [
  '', // For those that might leave this blank
  '(he/him)',
  '(he/him/his)',
  '(he/them)',
  '(she/her)',
  '(she/her/hers)',
  '(she/them)',
  '(they/them)',
  '(they/them/theirs)'
]

// URLs for random portrait images
const AVATAR_URL = [
  ...[...Array(95).keys()].map(val => (`https://randomuser.me/api/portraits/thumb/women/${val}.jpg`)),
  ...[...Array(95).keys()].map(val => (`https://randomuser.me/api/portraits/thumb/men/${val}.jpg`)),
  ...[...Array(10).keys()].map(val => (`https://randomuser.me/api/portraits/thumb/lego/${val}.jpg`))
]

const PRONOUN_AVATAR_MAP = {
  '': [190, 199],
  '(he/him)': [95, 189],
  '(he/him/his)': [95, 189],
  '(he/them)': [95, 189],
  '(she/her)': [0, 94],
  '(she/her/hers)': [0, 94],
  '(she/them)': [0, 94],
  '(they/them)': [190, 199],
  '(they/them/theirs)': [190, 199]
}

// Time to respond units
const TIME_UNITS = ['d', 'h', 'm']

// Possible values for collaboration status
const COLLABORATION = [
  'Open to collaboration',
  'Focused',
  'Currently collaborating'
]

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
    let rawOrgs = JSON.parse(rawOrgStr)

    // Adjust and then insert orgs
    rawOrgs = rawOrgs.map((org, i) => (
      { ...org, description: (Math.random() < 0.1 ? '' : getRandomDescription()) }
    ))
    await DBHelp.clearCollection(DBHandle, 'Units')
    const orgIDs = await DBHelp.insertAllInCollection(DBHandle, 'Units', rawOrgs)

    // Parse teams
    const rawTeamStr = fs.readFileSync('./rawOrgsAndTeams/testTeams.json', { encoding: 'utf8' })
    let rawTeams = JSON.parse(rawTeamStr)

    // Decorate with descriptions, culture, and random org IDs (~10% will have no org)
    rawTeams = rawTeams.map((team, i) => {
      const randOrgId = new ObjectID(orgIDs[Math.floor(Math.random() * rawOrgs.length)])
      return {
        name: team.name,
        description: (Math.random() < 0.1 ? '' : getRandomDescription()),
        culture: (Math.random() < 0.1 ? '' : getRandomCulture(team.name)),
        orgId: (Math.random() < 0.1 ? null : randOrgId)
      }
    })

    // Insert teams
    await DBHelp.clearCollection(DBHandle, 'Teams')
    const teamIDs = await DBHelp.insertAllInCollection(DBHandle, 'Teams', rawTeams)

    // Read and parse affects for setting random statuses
    const rawAffectsStr = fs.readFileSync('./rawAffects/affects.json', { encoding: 'utf8' })
    const rawAffects = JSON.parse(rawAffectsStr)

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

        // Pick some random affects
        const affectIndex = [-1, -1]
        do {
          affectIndex[0] = getRandIndex(rawAffects)
          affectIndex[1] = getRandIndex(rawAffects)
        } while (!rawAffects[affectIndex[0]].active || !rawAffects[affectIndex[1]].active)
        const privateAffect = (Math.random() >= 0.5)

        // Pick an appropriate avatar
        const pronoun = PRONOUNS[getRandIndex(PRONOUNS)]
        const avatarIndexes = PRONOUN_AVATAR_MAP[pronoun]
        const avatar = AVATAR_URL[getRandomInt(avatarIndexes[0], avatarIndexes[1])]

        // Return proper user
        rawUsers.push({
          /* User provided data */
          email: user.email,
          passwordHash,
          preferredPronouns: pronoun,
          name: `${user.name.first} ${user.name.last}`,
          preferredName: user.name.first,
          userType: (Math.random() > 0.75 ? 'admin' : 'standard'),

          /* Messaging Context Alias info */
          contextId: {
            msTeams: UUIDv4(),
            discord: (Math.random() * 10e18).toFixed(0).padStart(18, '0'),
            slack: (Math.random() * 10e10).toFixed(0).padStart(10, '0')
          },
          contextAlias: {
            msTeams: user.email,
            discord: user.login.username + '#' + getRandomSuffix(),
            slack: user.email
          },
          contextAvatar: {
            msTeams: (Math.random() < 0.125 ? '' : avatar),
            discord: (Math.random() < 0.125 ? '' : avatar),
            slack: (Math.random() < 0.125 ? '' : avatar)
          },

          /* Usage derived data */
          lastLogin: {
            timestamp: randomTimestamp(),
            remoteAddress: getRandomLocalIP(),
            discord: {
              timestamp: randomTimestamp(),
              remoteAddress: getRandomLocalIP()
            },
            msTeams: {
              timestamp: randomTimestamp(),
              remoteAddress: getRandomLocalIP()
            },
            slack: {
              timestamp: randomTimestamp(),
              remoteAddress: getRandomLocalIP()
            }
          },

          status: {
            currentAffectID: rawAffects[affectIndex[0]]._id,
            privateAffectID: rawAffects[affectIndex[1]]._id,
            currentAffectPrivacy: privateAffect,
            collaboration: COLLABORATION[getRandIndex(COLLABORATION)],
            timeToRespond: {
              time: getRandomInt(1, 24),
              units: TIME_UNITS[getRandIndex(TIME_UNITS)],
              automatic: Math.random() >= 0.5
            }
          },

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

/**
* Returns a random integer between min (inclusive) and max (inclusive).
* The value is no lower than min (or the next integer greater than min
* if min isn't an integer) and no greater than max (or the next integer
* lower than max if max isn't an integer).
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt (low, high) {
  low = Math.ceil(low)
  high = Math.floor(high)
  return Math.floor(Math.random() * (high - low + 1)) + low
}

function getRandIndex (array) {
  return getRandomInt(0, array.length - 1)
}

function getRandomLocalIP () {
  return `192.168.${getRandomInt(0, 255)}.${getRandomInt(1, 255)}`
}

function randomDate (start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start))
  var hour = startHour + Math.random() * (endHour - startHour) | 0
  date.setHours(hour)
  return date
}

function randomTimestamp () {
  let startDate = new Date(
    getRandomInt(2010, 2020),
    getRandomInt(0, 11),
    getRandomInt(0, 27)
  )

  let endDate = new Date(
    getRandomInt(2010, 2020),
    getRandomInt(0, 11),
    getRandomInt(0, 27)
  )

  if (endDate < startDate) {
    const temp = endDate
    endDate = startDate
    startDate = temp
  }

  return randomDate(startDate, endDate, 5, 20)
}

function getRandomSuffix () {
  return `${getRandomInt(0, 9)}${getRandomInt(0, 9)}${getRandomInt(0, 9)}${getRandomInt(0, 9)}`
}

function getRandomDescription () {
  return lorem.generateParagraphs(1)
}

function getRandomCulture (teamName) {
  // Generate a title
  let culture = `# ${teamName} Culture Document\n\n`

  // Generate a few paragraphs
  for (let i = 0; i < getRandomInt(1, 3); i++) {
    culture += lorem.generateParagraphs(1)
    culture += '\n\n'
  }

  // Randomly add more sections
  while (Math.random() > 0.333) {
    // A section heading
    culture += generateHeading(2)
    culture += '\n'

    // Generate some paragraphs or lists
    for (let i = 0; i < getRandomInt(2, 5); i++) {
      if (Math.random() > 0.5) {
        culture += generateList()
      } else {
        culture += lorem.generateParagraphs(1)
        culture += '\n'
      }
      culture += '\n'
    }

    // Possibly add a sub-section
    if (Math.random() > 0.6) {
      culture += generateHeading(3)
      culture += '\n'
      culture += lorem.generateParagraphs(1)
      culture += '\n\n'
    }
    culture += '\n'
  }

  return culture
}

function generateHeading (level) {
  return `${'#'.repeat(level)} ${lorem.generateWords(getRandomInt(1, 3))}\n`
}

function generateList () {
  const items = getRandomInt(3, 10)
  return [...Array(items).keys()].map((val) => (
    `- ${lorem.generateWords(getRandomInt(3, 8))}`
  )).join('\n') + '\n'
}
