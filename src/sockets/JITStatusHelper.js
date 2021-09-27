import * as DBUser from '../mongo/userController.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:socket-JIT-status-helper')

export async function lookupJITStatuses (curUserAliasId, message, context) {
  const processed = [curUserAliasId]

  // Lookup statuses for user being replied to
  const replyToStatus = getStatuses([message.replyId], context, processed)
  processed.push(message.replyId)

  // Lookup statuses for mentions
  const mentionStatus = getStatuses(message.mentions, context, processed)
  processed.push(...message.mentions)

  // Lookup statuses for participants
  const participantStatus = getStatuses(message.participants, context, processed)

  // Return what we found
  return [replyToStatus, mentionStatus, participantStatus]
}

async function getStatuses (aliasArray, context, filterOut) {
  if (Array.isArray(aliasArray) && aliasArray.length > 0) {
    aliasArray = aliasArray.filter((curAlias) => (!filterOut.includes(curAlias)))
    const userIDs = await DBUser.getIdsFromAliasList(context, aliasArray)
    const userStatuses = await DBUser.listUsersFromArray(userIDs)
    return userStatuses
  }

  return []
}
