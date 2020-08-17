export function computeWordRects (textBox, searchWords) {
  // Clone the text box
  const ghostTextBox = textBox.clone()
  ghostTextBox.empty()

  // Split the message into words
  const allWords = textBox.text().split(' ')

  // Loop over words and surround matched ones with a span
  let gatheredText = ''
  allWords.forEach((curWord) => {
    if (searchWords.includes(curWord.replace(/\W/g, ''))) {
      ghostTextBox.append(document.createTextNode(gatheredText + ' '))
      ghostTextBox.append($('<span>').addClass('highlight-word-span').text(curWord))
      gatheredText = ' '
    } else {
      gatheredText += (curWord + ' ')
    }
  })
  ghostTextBox.append(document.createTextNode(gatheredText))

  // Append the cloned text box so we can measure it
  textBox.after(ghostTextBox)

  // Retrieve the rects
  const textRect = ghostTextBox[0].getBoundingClientRect()
  const wordRects = []
  $('.highlight-word-span').each((i, span) => {
    const rect = span.getBoundingClientRect()
    wordRects.push({
      left: rect.left - textRect.left,
      top: rect.top - textRect.top,
      width: rect.width,
      height: rect.height
    })
  })

  // Remove the cloned text box and return the rects
  ghostTextBox.remove()
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
