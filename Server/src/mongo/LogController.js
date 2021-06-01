// New DB connector (refactored 6/1/2021)
import { connect as retrieveDBHandle, closeClient } from './connect.js'

// for using the database
import { ObjectID } from 'mongodb'

// Re-export closeClient
export { closeClient }

// print messages only during debug (NOT CURRENTLY NEEDED)
// import Debug from 'debug'
// const debug = Debug('mongo:logController')

/**
 * Log a message to the logging database
 *
 * tested in test 21 of test.js
 *
 * @param {string} collectionName the name of the collection in the log database
 * @param {object} message the message object being sent
 * @param {string} [correspondentID] the id of the person being replied to, may be empty
 * @param {object} [promptObj] the message object that prompted this response
 * @param {string} [userID] the user sending the message
 * @return {Promise} A promise that resolves to a document (see MongoDB.insertOne() for details):
 *                    - A field 'insertedId' with the _id value of the inserted document.
 */
async function logMessage (collectionName, message, correspondentID, promptObj, userID) {
  // PromptObj is optional, treat as UserID if wrong type
  if (userID === undefined && typeof promptObj === 'string') {
    userID = promptObj
    promptObj = undefined
  }

  // Build the insertion document
  const insertThis = {
    message: message,
    prompt: promptObj,
    timestamp: new Date(),
    userID: (ObjectID.isValid(userID) ? new ObjectID(userID) : undefined),
    correspondentID: (ObjectID.isValid(correspondentID) ? new ObjectID(correspondentID) : undefined)
  }

  // Get DB handle and insert it
  const DBHandle = await retrieveDBHandle('karunaLogs')
  return DBHandle.collection(collectionName).insertOne(insertThis)
}

/**
 * Logs messages from the wizard
 *
 * tested in test 20 of test.js
 *
 * @param {object} message the wizard message getting logged
 * @param {string} correspondentID the id of the person being replied to, may be empty
 * @return {Promise} A promise that resolves to a document (see MongoDB.insertOne() for details):
 *                    - A field 'insertedId' with the _id value of the inserted document.
 */
export function logWizardMessage (message, correspondentID) {
  return logMessage('wizardLogs', message, correspondentID)
}

/**
 * Logs messages from watson
 *
 * @param {Object} messageObj the watson message getting logged
 * @param {Object} promptObj the previous message the prompted this response
 * @param {string} correspondentID the id of the person being replied to, may be empty
 * @return A document containing:
 * - A boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled.
 * - A field insertedId with the _id value of the inserted document (the message).
 */
export function logWatsonMessage (messageObj, promptObj, correspondentID) {
  return logMessage('watsonLogs', messageObj, correspondentID, promptObj)
}

/**
 * Retrieve details for the given team
 *
 * tested in test 21 of test.js
 *
 * @param {object} message the wizard message getting logged
 * @param {string} correspondentID the id of the person being replied to, may be empty
 * @param {string} userID the user sending the message
 * @return A document containing:
 * - A boolean acknowledged as true if the operation ran with write concern or false if write concern was disabled.
 * - A field insertedId with the _id value of the inserted document (the message).
 */
export function logUserMessage (message, correspondentID, userID) {
  return logMessage('userLogs', message, correspondentID, userID)
}
