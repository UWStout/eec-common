/*
tests database functions within userController, teamController, and authController
*/

// Basic HTTP routing library
import Express from 'express'

// Authorization token library (not currently in use)
// import JWT from 'jsonwebtoken'
/*
// Utility functions
import * as UTIL from './utils.js'

// Database controller
import * as DBSelector from './dbSelector.js'

// Authentication helpers (not currently in use)
import { authenticateToken, decodeToken } from './auth.js'

// Create debug output object
import Debug from 'debug'

// for using the database
import MongoDB from 'mongodb'

// const debug = Debug('karuna:server:test')

// Extract ObjectId for easy usage
const { ObjectId } = MongoDB

*/
// Get database controllers
// const authDB = getDBAuthController() // (not currently in use)
/*
const teamDB = DBSelector.getDBTeamController()
const userDB = DBSelector.getDBUserController()
const unitDB = DBSelector.getDBUnitController()
const logDB = DBSelector.getDBLogController()
const affectDB = DBSelector.getDBAffectController()
*/

// Create a router to attach to an express server app
const router = new Express.Router()

// ******* API routes **************

// 1. tests authController validateUser (email, password) function
// also tested in auth.js with https://localhost:3000/auth/login

// 2. test userController emailExists and
// 3. test authController function createUser (firstName, lastName, email, userType, password)
// also tested in auth.js with https://localhost:3000/auth/register

// 4. test teamController listTeams
// also tested within team.js with https://localhost:3000/data/team/list

// 12. test userController's list user function with listUsers(req.query.fullInfo === undefined, perPage, page)
// done within user.js at https://localhost:3000/data/user/list?fullInfo=true&perPage=10&page=0

// 13. test userController's update user function with updateUser(userID, { firstName, lastName, teams, meta: userMeta })
// done within user.js at https://localhost:3000/data/user/update/

// 14. test userController's promote user function with updateUser(userID, { userType: 'admin' })
// done within user.js at https://localhost:3000/data/user/promote/

// 15. test userController's getUserDetails(userID) function
// done within user.js at https://localhost:3000/data/user/5ff742f09bb9905f98eb348e

// 19. test teamControllers updateTeam (userID, newData)
// tested within https://localhost:3000/data/team/update

// 22. test userController's function getUserCount () has been moved

// 23. test unitController's function updateOrgUnits (userID, newData)
// tested in orgUnit.js under endpoint 'data/unit/update'

// 24. test unitController's function listOrgUnits (IDsOnly = true, perPage = 25, page = 1, sortBy = '', sortOrder = 1, filterBy = '', filter = '')
// tested in orgUnit.js under endpoint 'data/unit/list'

// 25-32 tested affectController functions, and has been moved to affect.js

// 33-35 moved tested userController functions with regards to the status object, and have been moved to user.js

// Expose the router for use in other files
export default router
