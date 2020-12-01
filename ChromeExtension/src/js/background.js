// Import all the setup functions needed
import { announceSession } from './backgroundModules/SocketComms.js'
import { setupExtensionCommunication } from './backgroundModules/ExtensionComms.js'
import { setupWebRequests } from './backgroundModules/WebRequests.js'

// Setup each module of the background script
announceSession()
setupExtensionCommunication()
setupWebRequests()
