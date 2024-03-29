// Import the handlebars template library
import Handlebars from 'handlebars'

// Database log and user controller objects
import * as DBUser from '../mongo/userController.js'
import * as DBLog from '../mongo/logController.js'

// Socket methods
import { decodeToken, getMySocket } from '../sockets.js'

// Helper methods
import { parseMessageCommands, parseOtherUsers } from './socketMessageHelper.js'
import { EXCLUDED_TOKEN_PROPS } from '../sessionManager.js'

// Read env variables from the .env file
import dotenv from 'dotenv'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:wizard-socket-engine')

// Adjust env based on .env file
dotenv.config()

// Option to enable the wizard
// NOTE: Can conflict with Watson, consider only having one enabled
const WIZARD_ENABLED = process.env?.WIZARD_ENABLED === 'true'
export function isWizardEnabled () { return WIZARD_ENABLED }

const wizardSessions = {}
export function getWizardSession (id) {
  return wizardSessions[id]
}

export function clearWizardSession (id) {
  if (id) { wizardSessions[id] = undefined }
}

// Establish an in-memory session for a connected wizard
// - 'this' = current socket
export function socketWizardSession (wizardInfo) {
  if (!wizardInfo.token) {
    console.error('ERROR: Wizard session missing access token')
  } else {
    const tokenPayload = decodeToken(wizardInfo.token)
    wizardSessions[this.id] = { ...tokenPayload }
    if (this.request.session) {
      this.request.session.type = 'wizard'
      this.request.session.userInfo = tokenPayload
      EXCLUDED_TOKEN_PROPS.forEach((propKey) => {
        delete this.request.session.userInfo[propKey]
      })
    }

    if (wizardSessions[this.id]) {
      debug(`[WS:${this.id}] updated wizard session for ${wizardSessions[this.id].email}`)
    } else {
      debug(`[WS:${this.id}] new wizard session for ${wizardSessions[this.id].email}`)
    }

    // Join the wizards room and send the wizard a list of active sessions
    this.join('wizards')
    // TODO: Update to new session system
    // getMySocket().to(this.id).emit('updateSessions', getAllClientSessions())

    // Record the wizard login in user entry in database
    const req = this.request
    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
    DBUser.updateUserTimestamps(wizardSessions[this.id].id, address, true)
      .catch((err) => {
        console.error('WARNING: Failed to update wizard login timestamp')
        console.error(err)
      })
  }
}

// Broadcast a message from a wizard to a specific client
export async function socketWizardMessage (messageInfo) {
  // Try to lookup user by email
  let userInfo = null
  try {
    userInfo = await DBUser.getInfoFromEmail(messageInfo.clientEmail)
    userInfo.id = userInfo._id
  } catch (err) {
    debug('Error getting user info:', err)
  }

  // Did we find the user?
  if (!userInfo) {
    debug('Wizard message failed: could not lookup email', messageInfo.clientEmail)
    return
  }

  // Pull out some local variables
  let messageText = messageInfo.content

  // Scan for and replace any karuna-specific commands
  messageText = parseMessageCommands(messageText, messageInfo)

  // Are any user status variables being used?
  let userStatus = { affect: 'unknown', timeToRespond: 'unknown', collaboration: 'unknown' }
  if (messageText.match(/{{\s*user\.status.*?}}/)) {
    // Retrieve user status
    try {
      const response = await DBUser.getUserStatus(userInfo.id)
      if (response) {
        userStatus = {
          affect: response.currentAffectID || 'unknown',
          timeToRespond: response.timeToRespond || NaN,
          collaboration: response.collaboration || 'unknown'
        }
      }
    } catch (err) {
      debug('Error getting user status')
      debug(err)
    }
  }

  try {
    // Get any extra user data needed for mentioned users
    const extraUsers = await parseOtherUsers(messageText, messageInfo, DBUser)

    // Fill-in handlebars templates if they exist
    if (messageText.includes('{{')) {
      const msgTemplate = Handlebars.compile(messageText)
      messageText = msgTemplate({
        user: {
          ...userInfo,
          type: userInfo.userType,
          status: userStatus
        },
        ...extraUsers
      })
    }

    // Update message text and save in log (not waiting on logging, but we do catch errors)
    messageInfo.content = messageText
    // DBLog.logWizardMessage(messageInfo, userInfo.id)
    //   .catch((err) => {
    //     debug('Logging of wizard message failed')
    //     debug(err)
    //   })

    // Send the message on to client
    debug(`[WS:${this.id}] wizard message for client ${messageInfo.clientEmail} in ${messageInfo.context}`)
    getMySocket().to(messageInfo.clientEmail).emit('karunaMessage', messageInfo)
  } catch (err) {
    debug('Error awaiting other user parsing')
    debug(err)
  }
}
