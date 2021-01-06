// Import all the setup functions needed
import { announceSession } from './modules/SocketComms.js'
import { setupExtensionCommunication } from './modules/ExtensionComms.js'
import { setupWebRequests } from './modules/WebRequests.js'

// Setup each module of the background script
announceSession()
setupExtensionCommunication()
setupWebRequests()
