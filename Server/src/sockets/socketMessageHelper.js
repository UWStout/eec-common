// Setup debug for output
import Debug from 'debug'
const socketHelperDebug = Debug('karuna:server:socket-message-helper')

export function parseMessageCommands (messageText, messageInfo) {
  // Scan for and replace any karuna-specific commands
  let inputCount = 0
  const newMessageText = messageText.replace(
    /{{\s*(\w+)\s*:\s*\[?([\w,\s]+?)\]?\s*}}/g,
    (match, cmdName, cmdData) => {
      switch (cmdName.toLowerCase()) {
        // Highlight user message words
        case 'highlight': {
          const words = cmdData.split(',').map(word => (word.trim()))
          if (!messageInfo.highlight) {
            messageInfo.highlight = words
          } else {
            messageInfo.highlight.push(words)
          }
          return ''
        }

        // Show the affect prompt input
        case 'affect': {
          return (`
            <button type="button" class="karunaAffectInput">Respond</button>
          `).trim().replace(/[\s\n\r]+/g, ' ') // <-- strips unnecessary whitespace
        }

        // Show a custom text-input box
        case 'input': {
          inputCount++
          return (`
            <input type="text" id="karunaInput${inputCount}" name="${cmdData}" />
            <button type="button" data-source="#karunaInput${inputCount}" class="karunaCustomInput">
              Send
            </button>
          `).trim().replace(/[\s\n\r]+/g, ' ') // <-- strips unnecessary whitespace
        }

        // Show a custom text-input box
        case 'update': {
          // cmdData contains what should be updated
          const args = cmdData.split(',').map(word => (word.trim())) // creates an array called words
          if (!Array.isArray(messageInfo.update)) {
            messageInfo.update = []
          }
          messageInfo.update.push({ user_status_option: args[0], newStatus: args[1] })
          return ''
        }

        // Anything else (just remove it)
        default:
          socketHelperDebug(`WARNING: Unknown command ${cmdName} in wizard message`)
          return ''
      }
    }
  )

  return newMessageText
}

export function parseOtherUsers (messageText, messageInfo, DBUser) {
  // Are any other users (mentioned users) variables being used?
  const otherMatches = messageText.match(/{{\s*(otherUser\d+)(?:\..*?)?}}/g)
  if (!otherMatches) { return Promise.resolve({}) }

  // Retrieve all the necessary user data (caution, async hell ahead)
  return new Promise((resolve, reject) => {
    // Retrieve user status
    const extraUsers = {}
    Promise.all(otherMatches.map(async (otherMatch) => {
      // Extract relevant user variable parts
      const data = otherMatch.match(/{{\s*(otherUser(\d+))(?:\..*?)?}}/)
      const varName = data[1]

      // Have we already retrieved info for this user?
      if (extraUsers[varName] === undefined) {
        extraUsers[varName] = {}

        const mentionIndex = parseInt(data[2]) - 1
        let userDetails = {
          firstName: 'firstName' + mentionIndex,
          lastName: 'firstName' + mentionIndex,
          email: 'email' + mentionIndex + '@example.com',
          userType: 'type' + mentionIndex,
          status: {
            currentAffectID: 'affect' + mentionIndex,
            timeToRespond: 'timeToRespond' + mentionIndex,
            collaboration: 'collaboration' + mentionIndex
          }
        }

        // Retrieve user details (TODO: Implement this)
        if (messageInfo.mentions && mentionIndex < messageInfo.mentions.length) {
          const otherUserID = await DBUser.lookupIDByContextHandle(messageInfo.mentions[mentionIndex], messageInfo.context)
          userDetails = await DBUser.getUserDetails(otherUserID)
        }

        // Add details to the extra users variable
        extraUsers[varName] = {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          type: userDetails.userType,
          status: {
            affect: userDetails.status.currentAffectLogID,
            timeToRespond: userDetails.status.timeToRespond,
            collaboration: userDetails.status.collaboration
          }
        }
      }
    })).then(() => {
      return resolve(extraUsers)
    }).catch((err) => {
      return reject(err)
    })
  })
}
