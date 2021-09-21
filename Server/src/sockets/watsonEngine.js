// Database log and user controller objects
import * as DBLog from '../mongo/logController.js'

import { getClientSession } from './clientEngine.js'

// Setup debug for output
import Debug from 'debug'
const debug = Debug('karuna:server:watson-socket-engine')

// Attempt to send message to client FROM Watson
// - 'this' = client socket
export function sendWatsonResponse (responseText, clientPromptObj, clientContext, entities, intents) {
  if (responseText.trim() === '') {
    console.log('ignoring empty watson message')
    return
  }

  const messageObj = {
    clientEmail: getClientSession(this.id).email,
    context: clientContext,
    content: responseText,
    isWatson: true,
    entities,
    intents
  }

  DBLog.logWatsonMessage(messageObj, clientPromptObj, getClientSession(this.id).id)
    .catch((err) => {
      debug('Logging of watson message failed')
      debug(err)
    })

  console.log('sending response from watson')
  this.emit('karunaMessage', messageObj)
}
