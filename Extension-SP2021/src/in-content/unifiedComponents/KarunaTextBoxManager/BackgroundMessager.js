import { CONTEXT } from '../../../util/contexts'

export function updateMessageText (event, JQTextBox, contextName = CONTEXT.DISCORD) {
  // Send changed text to the server
  if (contextName === CONTEXT.MS_TEAMS) {
    // Find Mentions
    const mentions = []
    JQTextBox.find('span[data-itemprops]').each(function () {
      const jqElem = jQuery(this)
      const mentionData = jqElem.data('itemprops')
      if (mentionData?.mentionType === 'person') {
        mentions.push({
          userAlias: mentionData.mri,
          value: jqElem.text()
        })
      }
    })

    // Return text of message with mentions
    const tree = jQuery.parseHTML(event.target.innerHTML)
    if (!Array.isArray(tree)) {
      return [event.target.textContent, mentions]
    } else {
      const text = []
      tree.forEach((div) => { text.push(div.textContent) })
      return [text.join('\n'), mentions]
    }
  } else {
    // Find mentions
    const mentions = []
    JQTextBox.find('.mention').each(function () {
      const jqElem = jQuery(this)
      mentions.push({
        userAlias: jqElem.attr('aria-label'),
        value: jqElem.text()
      })
    })

    // Return text of message with mentions
    return [event.target.textContent, mentions]
  }
}

export function sendTextToServer (newText, mentions = []) {
  if (this.backgroundPort) {
    this.backgroundPort.postMessage({
      type: 'textUpdate',
      context: this.contextName,
      content: newText,
      mentions
    })
  }
}
