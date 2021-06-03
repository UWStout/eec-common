/**
 * Documentation
 * - mocha: https://mochajs.org/
 * - chai: https://www.chaijs.com/api/bdd/
 */

import 'core-js/stable'
import 'regenerator-runtime/runtime'

// Database controller
import { getDBUserController } from '../src/routes/dbSelector.js'

import { close } from '../src/mongo/connect.js'

// Setup the chai assertion library
import { expect } from 'chai'

import path from 'path'
import fs from 'fs'

// Get database auth and user controller objects
const DBUser = getDBUserController()

// Mocha function
describe('user controller test', function () {
  // 'this' is current instance of Mocha
  
  // To-Do: data in testData is not properly formatted for testing, but should eventually be used for comparison against data in mongo database
  // const rawUserData = fs.readFileSync(path.resolve('./testData/rawUsers/usersPage1.json'), { encoding: 'utf8' })
  // const userData = JSON.parse(rawUserData)

  it('retrieves a user', async function () {
    const user = await DBUser.getUserDetails('5ff742f09bb9905f98eb348e')
    expect(user).to.have.members([
      { firstName: 'Seth' }, { lastName: 'Berrier' }
    ])
  })

  after(function () {
    close('karunaData')
  })
})
