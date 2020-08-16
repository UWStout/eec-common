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

const EECElementList = new Set()
function updateTextBoxes () {
  const textBoxes = document.querySelectorAll('[role="textbox"]')
  console.log('EEC-Extension: checking ' + textBoxes.length + ' textbox(es).')
  textBoxes.forEach((textBox) => {
    if (!EECElementList.has(textBox)) {
      textBox.insertAdjacentHTML('afterend',
        '<eec-extension data-text="Some explanatory text goes here." />'
      )
      EECElementList.add(textBox)
    }
  })
}

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true }

// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      updateTextBoxes()
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Start observing the target node for configured mutations
observer.observe(document.body, config)

