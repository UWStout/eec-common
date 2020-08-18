/**
 * in-content.js
 *
 * This file has an example on how to communicate with other parts of the extension through a long
 * lived connection (port) and also through short lived connections (chrome.runtime.sendMessage).
 *
 * Note that in this scenario the port is open from the popup, but other extensions may open it from
 * the background page or not even have either background.js or popup.js.
 **/
import './objects/EECExtension.js'

// Detect discord or teams
const IS_DISCORD = window.location.host.includes('discord')
if (IS_DISCORD) { console.log('DISCORD DETECTED') }

const IS_TEAMS = window.location.host.includes('teams.microsoft.')
if (IS_TEAMS) { console.log('MS TEAMS DETECTED') }

const EECElementList = new Map()
function updateTextBoxes () {
  // Try slate editor first (for discord)
  let textBoxes
  if (IS_DISCORD) {
    textBoxes = document.querySelectorAll('[data-slate-editor]')
  } else {
    // Fall back to generic editable divs (with role 'textbox')
    textBoxes = document.querySelectorAll('[role="textbox"]')
  }

  // Loop over each textbox and install an extension element
  // for it if one does not already exist.
  textBoxes.forEach((textBox) => {
    let key = textBox
    if (IS_DISCORD) {
      key = textBox.getAttribute('aria-label')
    }
    if (!EECElementList.has(key)) {
      console.log(`Adding New EEC Extension for (${EECElementList.size + 1} added)`)

      // Build extension
      const extensionElem = document.createElement('eec-extension')
      extensionElem.wordList = ['test', 'seth', 'the']
      extensionElem.setTextBox(textBox)

      // Insert it and add to lookup map
      textBox.parentNode.insertBefore(extensionElem, textBox.nextSibling)
      EECElementList.set(key, extensionElem)
    }
  })
}

// Callback function to execute when mutations are observed
const mutationCallback = (mutationsList, observer) => {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      updateTextBoxes()
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationCallback)

// Start observing the target node for configured mutations
observer.observe(document.body, { childList: true, subtree: true })
