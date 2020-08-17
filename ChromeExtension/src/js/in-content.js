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

const EECElementList = new Map()
function updateTextBoxes () {
  // Try slate editor first (for discord)
  let textBoxes = document.querySelectorAll('[data-slate-editor')
  if (textBoxes.length < 1) {
    // Fall back to generic editable divs (with role 'textbox')
    textBoxes = document.querySelectorAll('[role="textbox"]')
  }

  // Loop over each textbox and install an extension element
  // for it if one does not already exist.
  textBoxes.forEach((textBox) => {
    if (!EECElementList.has(textBox)) {
      // Build extension
      const extensionElem = document.createElement('eec-extension')
      extensionElem.wordList = ['test', 'seth', 'the']
      extensionElem.setTextBox(textBox)

      // Insert it and add to lookup map
      textBox.parentNode.insertBefore(extensionElem, textBox.nextSibling)
      EECElementList.set(textBox, extensionElem)
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
