import * as DBUser from '../mongo/userController.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:socket-JIT-status-helper')

export async function lookupJITStatuses (curUserAliasId, message, context) {
  const processed = [curUserAliasId]

  // Lookup statuses for user being replied to
  const replyToStatus = await getStatuses(message.replyId, context, processed)
  processed.push(message.replyId)

  // Lookup statuses for mentions
  const mentionStatus = await getStatuses(message.mentions, context, processed)
  processed.push(message.mentions)

  // Lookup statuses for participants
  const participantStatus = await getStatuses(message.participants, context, processed)

  // Return what we found
  return [replyToStatus, mentionStatus, participantStatus]
}

async function getStatuses (aliasArray, context, filterOut) {
  // A few sanity checks
  if (!aliasArray) { return [] }
  if (!Array.isArray(aliasArray)) {
    aliasArray = [aliasArray]
  }

  // Remove any duplicates
  aliasArray = aliasArray.filter((curAlias) => (!filterOut.includes(curAlias)))

  if (aliasArray.length > 0) {
    try {
      // Lookup alias values
      const aliasLookup = await DBUser.getIdsFromAliasList(context, aliasArray)

      // Convert to array of userIDs
      const userIDs = []
      aliasArray.forEach((alias) => {
        if (aliasLookup[alias]) {
          userIDs.push(aliasLookup[alias])
        }
      })

      // Convert to statuses
      if (userIDs.length > 0) {
        const userStatuses = await DBUser.listUsersFromArray(userIDs)
        return userStatuses
      }
    } catch (err) {
      debug('Failed to get statuses')
      debug(err)
    }
  }

  return []
}
