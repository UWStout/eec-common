// Database log and user controller objects
import * as DBLog from '../mongo/logController.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:watson-socket-engine')

// Option to enable the Watson analysis engine
// NOTE: Can conflict with Wizard, consider only having one enabled
const WATSON_ENABLED = (process.env?.WATSON_ENABLED === 'true')
export function isWatsonEnabled () { return WATSON_ENABLED }

// Attempt to send message to client FROM Watson
// - 'this' = client socket
export function sendWatsonResponse (responseText, clientPromptObj, clientContext, entities, intents) {
  if (responseText.trim() === '') {
    console.log('ignoring empty watson message')
    return
  }

  const userInfo = this.request.session.userInfo
  const messageObj = {
    clientEmail: userInfo.email,
    context: clientContext,
    content: responseText,
    isWatson: true,
    entities,
    intents
  }

  DBLog.logWatsonMessage(messageObj, clientPromptObj, userInfo.id)
    .catch((err) => {
      debug('Logging of watson message failed')
      debug(err)
    })

  console.log('sending response from watson')
  this.emit('karunaMessage', messageObj)
}
