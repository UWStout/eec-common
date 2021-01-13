import EECExtensionCSS from './EECExtension.txt'

import debounce from 'debounce'

import { computeWordRects, makeFixedPositionChildDiv } from './TextUtility.js'
import { ResizeObserver as ROPolyfill } from '@juggle/resize-observer'
import { CONTEXT } from '../../util/contexts'

// Use polyfill only if needed
const ResizeObserver = window.ResizeObserver || ROPolyfill

class EECExtension extends HTMLElement {
  constructor () {
    super()

    // Create a shadow root
    this.attachShadow({ mode: 'open' })

    // Read the JWT for later use
    chrome.runtime.sendMessage(
      { type: 'read', key: 'JWT' },
      (response) => {
        this.JWT = response
      }
    )
  }

  setupElement () {
    // Create some CSS to apply to the shadow dom
    this.styleElem = document.createElement('style')
    this.styleElem.textContent = EECExtensionCSS

    // Make elements to hold the markup
    const markupDivs = makeFixedPositionChildDiv(
      this.textBox, window.innerWidth, window.innerHeight,
      'eec-markup-wrapper', 'eec-markup', true)
    this.markupWrapper = markupDivs[0]
    this.markupDiv = markupDivs[1]

    // Attach the created elements to the shadow DOM
    this.shadowRoot.append(this.styleElem, this.markupWrapper)
  }

  // Custom Element is mounted to the DOM
  connectedCallback () {
    // Setup the positioning of this element
    this.style.cssText = 'position: absolute; top: 0px; left: 0px; z-index: 3;'
  }

  // Custom Element is unmounted from the DOM
  disconnectedCallback () {
    console.log('[[IN-CONTENT]] EEC-Extension element removed from page.')
  }

  // Custom Element is moved to a different DOM
  adoptedCallback () {
    console.log('[[IN-CONTENT]] EEC-Extension element moved to new page.')
  }

  // Update the textBox we are watching
  setTextBox (newTextBox) {
    this.textBox = jQuery(newTextBox)
    if (this.textBox) {
      // Create this element's html and styling
      this.setupElement()

      // Setup event listeners for the text box
      this.textBox.on('focusin', this.textBoxFocused.bind(this))
      this.textBox.on('focusout', this.textBoxBlurred.bind(this))
      this.textBox.on('input', debounce(this.textBoxInput.bind(this), 400, false))

      // Ensure backspace and delete keys trigger 'input' events
      this.textBox.on('keydown', (event) => {
        const key = event.keyCode || event.charCode
        if (key === 8 || key === 46) {
          this.textBox.trigger('input')
        }
      })

      // Observe and respond to resize events
      this.sizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const newSize = entries[0].borderBoxSize[0]
          this.markupWrapper.firstChild.style.width = `${newSize.inlineSize}px`
          this.markupWrapper.firstChild.style.height = `${newSize.blockSize}px`
        }
      })

      this.sizeObserver.observe(newTextBox)
    }
  }

  textBoxFocused (event) {
    // this.updateUnderlinedWords(this._wordList)
  }

  textBoxBlurred (event) {
    // this.updateUnderlinedWords(this._wordList)
  }

  textBoxInput (event) {
    // this.updateUnderlinedWords(this._wordList)

    // Send changed text to the server
    if (this.contextName === CONTEXT.MS_TEAMS) {
      const tree = jQuery.parseHTML(event.target.innerHTML)
      if (!Array.isArray(tree)) {
        this.sendTextToServer(event.target.textContent)
      } else {
        const text = []
        tree.forEach((div) => { text.push(div.textContent) })
        this.sendTextToServer(text.join('\n'))
      }
    } else {
      this.sendTextToServer(event.target.textContent)
    }
  }

  sendTextToServer (newText) {
    console.log('[[IN-CONTENT]] Text: ' + newText)
    if (this.backgroundPort) {
      this.backgroundPort.postMessage({
        type: 'textUpdate',
        context: this.contextName,
        content: newText
      })
    }
  }

  get wordList () { return this._wordList }
  set wordList (wordList) {
    this._wordList = wordList
  }

  updateUnderlinedWords (words) {
    if (this.textBox && this.markupWrapper) {
      this.markupDiv.textContent = ''
      const rects = computeWordRects(this.textBox, words)
      if (rects.length > 0) {
        rects.forEach((rect) => {
          const newHighlighter = document.createElement('div')
          newHighlighter.setAttribute('class', 'eec-highlighter')
          newHighlighter.style.cssText = `
            position: absolute;
            left: ${rect.left}px;
            top: ${rect.top}px;
            height: ${rect.height}px;
            width: ${rect.width}px;
            border-bottom: 1px solid #ff99ab;`
          this.markupDiv.append(newHighlighter)
        })
      }
    }
  }
}

// Define the new element and export it
customElements.define('eec-extension', EECExtension)
export default EECExtension