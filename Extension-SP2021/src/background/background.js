// Import all the setup functions needed
import { checkForVersionConflict } from './modules/DataStorage.js'
import { announceSession } from './modules/SocketComms.js'
import { setupExtensionCommunication } from './modules/ExtensionComms.js'
import { setupWebRequests } from './modules/WebRequests.js'

// Set version and check for upgrade/conflict
checkForVersionConflict()

// Setup each module of the background script
announceSession()
setupExtensionCommunication()
setupWebRequests()
