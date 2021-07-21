// import { analyzeMessage } from '../../../../../Server/src/analysisEngine.js'

// function getRanges (text) {
//   analyzeMessage (messageObj, userID, context)
// }

function traverseAndSpanifyWords (sourceElement, destinationElement, searchWords) {
  // Are there words to search for?
  if (!Array.isArray(searchWords) || searchWords.length < 1) {
    return
  }

  // Are there children to traverse?
  if (!sourceElement.hasChildNodes()) {
    return
  }

  // Loop over children
  let sourceChild = sourceElement.firstChild
  let destinationChild = destinationElement.firstChild
  while (sourceChild) {
    // Examine source child node type
    switch (sourceChild.nodeType) {
      // HTML Element node
      case Node.ELEMENT_NODE:
        traverseAndSpanifyWords(sourceChild, destinationChild, searchWords)
        break

        // Text node
      case Node.TEXT_NODE: {
        // Gather unmatched words to rebuild the text node
        let gatheredText = ''

        // Break text into words and check each one
        const allWords = sourceChild.nodeValue.split(' ')
        allWords.forEach((curWord) => {
          // Look for word in word list (without any punctuation)
          if (curWord !== '' && searchWords.includes(curWord.toLowerCase().replace(/\W/g, ''))) {
            // Place gathered text as text node & place word as span
            destinationChild.parentNode.insertBefore(
              document.createTextNode(gatheredText),
              destinationChild
            )
            console.log('*====&&&====* Highlighting word', curWord)
            destinationChild.parentNode.insertBefore(
              jQuery('<span>').addClass('highlight-word-span').text(curWord)[0],
              destinationChild
            )

            // Reset gathered text
            gatheredText = ' '
          } else {
            // Gather the word for appending later
            gatheredText += (curWord + ' ')
          }
        })

        // Any remaining gathered words should be appended here
        if (gatheredText !== ' ' && gatheredText !== '') {
          destinationChild.parentNode.insertBefore(
            document.createTextNode(gatheredText),
            destinationChild
          )
        }

        // Remove the destination child and make it point the previous node
        const prevDestination = destinationChild.previousSibling
        destinationChild.parentNode.removeChild(destinationChild)
        destinationChild = prevDestination
      } break
    }

    // Advance to next sibling
    sourceChild = sourceChild.nextSibling
    destinationChild = destinationChild.nextSibling
  }
}

function traverseAndSpanifyRanges (sourceElement, destinationElement, ranges, isCovered, setIsCovered) {
  // Are there words to search for?
  if (!Array.isArray(ranges) || ranges.length < 1) {
    return
  }

  // Are there children to traverse?
  if (!sourceElement.hasChildNodes()) {
    return
  }

  // Loop over children
  let sourceChild = sourceElement
  let destinationChild = destinationElement
  if (sourceChild && destinationChild) {
    sourceChild = sourceElement.firstChild
    destinationChild = destinationElement.firstChild
  } else {
    sourceChild = null
    destinationChild = null
  }
  while (sourceChild) {
    // Examine source child node type
    switch (sourceChild.nodeType) {
      // HTML Element node
      case Node.ELEMENT_NODE:
        traverseAndSpanifyRanges(sourceChild, destinationChild, ranges, isCovered, setIsCovered)
        break

        // Text node
      case Node.TEXT_NODE:
        ranges.forEach(([startIdx, endIdx], index) => {
          if (sourceChild.nodeValue.length - 1 < startIdx || sourceChild.nodeValue.length - 1 < endIdx) {
            console.log('not enough characters in textbox')
          } else if (!isCovered[index]) {
            // set is covered to true for index
            setIsCovered(index)

            // start creating a range for surrounding range in span for highlighting
            const range = new Range()
            range.setStart(sourceChild, startIdx)
            range.setEnd(sourceChild, endIdx)
            // clone content before deleting
            const content = range.cloneContents()
            range.deleteContents()
            // create new DOM element
            const newNode = document.createElement('SPAN')
            newNode.className = 'highlight-word-span'
            newNode.append(content)
            // insert the node where the non-highlighted word used to be
            range.insertNode(newNode)
          } else {
            console.log('ranges already covered')
          }
        })
        break
    }

    // Advance to next sibling
    if (sourceChild && destinationChild) {
      sourceChild = sourceChild.nextSibling
      destinationChild = destinationChild.nextSibling
    } else {
      sourceChild = null
      destinationChild = null
    }
  }
}

let ghostTextBox
export function computeWordRects (isWords, textBox, spanThese, isCovered, setIsCovered) {
  // Clone the text box
  if (ghostTextBox) {
    ghostTextBox.remove()
  }
  ghostTextBox = textBox.clone()
  ghostTextBox.css('background-color', 'lightgreen')

  if (isWords) {
  // Loop over words and surround matched ones with a span (force spanThese to be array)
    traverseAndSpanifyWords(textBox[0], ghostTextBox[0], (Array.isArray(spanThese) ? spanThese : []))
  } else { // is Ranges
    traverseAndSpanifyRanges(textBox[0], ghostTextBox[0], (Array.isArray(spanThese) ? spanThese : []), isCovered, setIsCovered)
  }
  // Append the cloned text box so we can measure it
  textBox.after(ghostTextBox)

  // Retrieve the rects
  const textRect = ghostTextBox[0].getBoundingClientRect()
  const wordRects = []
  jQuery('.highlight-word-span').each((i, span) => {
    const rect = span.getBoundingClientRect()
    wordRects.push({
      left: rect.left - textRect.left,
      top: rect.top - textRect.top,
      width: rect.width,
      height: rect.height
    })
  })

  // Clear out old text box
  ghostTextBox.remove()
  ghostTextBox = undefined

  // Return the rects
  return wordRects
}
