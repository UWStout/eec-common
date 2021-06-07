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
      case Node.TEXT_NODE:
        {
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
        }
        break
    }

    // Advance to next sibling
    sourceChild = sourceChild.nextSibling
    destinationChild = destinationChild.nextSibling
  }
}

let ghostTextBox
export function computeWordRects (textBox, searchWords) {
  // Clone the text box
  if (ghostTextBox) {
    ghostTextBox.remove()
  }
  ghostTextBox = textBox.clone()
  ghostTextBox.css('background-color', 'lightgreen')

  // Loop over words and surround matched ones with a span (force searchWords to be array)
  traverseAndSpanifyWords(textBox[0], ghostTextBox[0], (Array.isArray(searchWords) ? searchWords : []))

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

// Build a three div nested structure for absolute positioning
// of child elements in a sized area
export function makeFixedPositionChildDiv (sizeElement,
  innerWidth, innerHeight, wrapperClass, innerClass,
  disablePointerEvents) {
  const outsideWrapper = document.createElement('div')
  outsideWrapper.setAttribute('class', wrapperClass)
  outsideWrapper.style.cssText = `
    position: absolute;
    ${disablePointerEvents ? 'pointer-events: none;' : ''}
    top: 0px; left: 0px;`

  const middleDiv = document.createElement('div')
  middleDiv.style.cssText = `
    box-sizing: content-box;
    position: relative;
    top: 0px; left: 0px;
    width: ${sizeElement.outerWidth()}px;
    height: ${sizeElement.outerHeight()}px;
    ${disablePointerEvents ? 'pointer-events: none;' : ''}
    overflow: hidden;
    border: 0px; border-radius: 0px;
    padding: 0px; margin: 0px;`
  outsideWrapper.appendChild(middleDiv)

  const innerDiv = document.createElement('div')
  innerDiv.setAttribute('class', innerClass)
  innerDiv.style.cssText = `
    height: ${innerHeight}px;
    width: ${innerWidth}px;`
  middleDiv.append(innerDiv)

  return [outsideWrapper, innerDiv]
}
