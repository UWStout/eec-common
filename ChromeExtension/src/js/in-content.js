import './objects/EECExtension.js'

// Detect discord or teams
let contextName = 'NONE'
const IS_DISCORD = window.location.host.includes('discord')
if (IS_DISCORD) {
  contextName = 'discord'
  console.log('[[IN-CONTENT]] DISCORD DETECTED')
}

const IS_TEAMS = window.location.host.includes('teams.microsoft.')
if (IS_TEAMS) {
  contextName = 'msteams'
  console.log('[[IN-CONTENT]] MS TEAMS DETECTED')
}

// Initialize communication with background page
const extensionPort = chrome.runtime.connect({ name: contextName })

// Track and inject the extension for each text-box
const EECElementList = new Map()
function updateTextBoxes () {
  // Get all text-box elements
  let textBoxes
  if (IS_DISCORD) {
    // Any element with the property 'data-slate-editor'
    textBoxes = document.querySelectorAll('[data-slate-editor]')
  } else if (IS_TEAMS) {
    // Any element with the role 'textbox'
    textBoxes = document.querySelectorAll('[role="textbox"]')
  }

  // Loop over each text-box and install an extension element
  // for it if one does not already exist.
  textBoxes.forEach((textBox) => {
    let key = textBox
    if (IS_DISCORD) {
      key = textBox.getAttribute('aria-label')
    }
    if (!EECElementList.has(key)) {
      console.log(`[[IN-CONTENT]] Adding New EEC Extension for (${EECElementList.size + 1} added)`)

      // Build extension
      const extensionElem = document.createElement('eec-extension')
      extensionElem.backgroundPort = extensionPort
      extensionElem.wordList = ['test', 'seth', 'the', 'violence', 'meta']
      extensionElem.setTextBox(textBox)

      // Insert it and add to lookup map
      textBox.parentNode.insertBefore(extensionElem, textBox.nextSibling)
      EECElementList.set(key, extensionElem)
    }
  })
}

// Callback function to execute when mutations are observed
let userName = ''
let teamServerName = ''
let channelName = ''
const mutationCallback = (mutationsList, observer) => {
  // Attempt to update EEC text-boxes (if needed)
  updateTextBoxes()

  // Check team and channel names on any page mutation
  if (IS_TEAMS) {
    userName = $('img.user-picture').first().attr('upn')
    teamServerName = $('.school-app-team-title').text()
    channelName = $('.channel-name').text()
  } else if (IS_DISCORD) {
    const userArea = $('section[aria-label="User area"]')
    userName = userArea.text()
    teamServerName = userArea.parent().children().first().children().first().text()
    channelName = document.title
  }

  // Update data in the background script
  chrome.runtime.sendMessage({ type: 'write', key: 'userName', data: userName, contextName })
  chrome.runtime.sendMessage({ type: 'write', key: 'teamName', data: teamServerName, contextName })
  chrome.runtime.sendMessage({ type: 'write', key: 'channelName', data: channelName, contextName })
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationCallback)

// Start observing the target node for configured mutations
observer.observe(document.body, { childList: true, subtree: true })
