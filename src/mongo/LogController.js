import { retrieveDBHandle } from './connect.js'

// for using the database
import { ObjectID } from 'mongodb'

// print messages only during debug
import Debug from 'debug'
const debug = Debug('mongo:logController')

/**
 * Logs messages from the wizard
 *
 * tested in test 20 of test.js
 *
 * @param {string} message the wizard message getting logged
 * @param {_id} correspondentID the id of the person being replied to, may be empty
 * @return A document containing:
 * - A boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled.
 * - A field insertedId with the _id value of the inserted document (the message).
 */
export function logWizardMessage (message, correspondentID) {
  const DBHandle = retrieveDBHandle('karunaLogs')
  let insertThis

  if (!correspondentID) {
    insertThis = { message: message }
  } else insertThis = { message: message, timestamp: new Date(), correspondentID: new ObjectID(correspondentID) }
  var c = DBHandle.collection('wizardLogs')
  return c.insertOne(insertThis)
}

/**
 * Logs messages from watson
 *
 * @param {Object} messageObj the watson message getting logged
 * @param {Object} promptObj the previous message the prompted this response
 * @param {_id} correspondentID the id of the person being replied to, may be empty
 * @return A document containing:
 * - A boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled.
 * - A field insertedId with the _id value of the inserted document (the message).
 */
export function logWatsonMessage (messageObj, promptObj, correspondentID) {
  const DBHandle = retrieveDBHandle('karunaLogs')
  const insertThis = {
    message: messageObj,
    prompt: promptObj,
    timestamp: new Date(),
    correspondentID: (correspondentID ? new ObjectID(correspondentID) : undefined)
  }

  var c = DBHandle.collection('watsonLogs')
  return c.insertOne(insertThis)
}

/**
 * Retrieve details for the given team
 *
 * tested in test 21 of test.js
 *
 * @param {string} message the wizard message getting logged
 * @param {_id} correspondentID the id of the person being replied to, may be empty
 * @param {_id} userID the user sending the message
 * @return A document containing:
 * - A boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled.
 * - A field insertedId with the _id value of the inserted document (the message).
 */
export function logUserMessage (message, correspondentID, userID) {
  const DBHandle = retrieveDBHandle('karunaLogs')
  let insertThis

  if (!correspondentID) {
    insertThis = { message, timestamp: new Date(), userID: new ObjectID(userID) }
  } else insertThis = { message: message, timestamp: new Date(), correspondentID: new ObjectID(correspondentID), userID: new ObjectID(userID) }
  return DBHandle
    .collection('userLogs')
    .insertOne(insertThis)
}
