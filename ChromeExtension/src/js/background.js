// Import all the setup functions needed
import { setupSocketCommunication } from './backgroundModules/SocketComms.js'
import { setupExtensionCommunication } from './backgroundModules/ExtensionComms.js'
import { setupWebRequests } from './backgroundModules/WebRequests.js'

// Setup each module of the background script
setupSocketCommunication()
setupExtensionCommunication()
setupWebRequests()
