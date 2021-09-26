import { CONTEXT } from '../../../util/contexts'

export function updateMessageText (event, JQTextBox, contextName) {
  // Send changed text to the server
  switch (contextName) {
    case CONTEXT.MS_TEAMS: {
      // Is this a reply (and to whom)
      let replyId = ''
      if (JQTextBox.attr('aria-label').includes('Reply')) {
        const msgNode = JQTextBox.parentsUntil('.ts-expanded-message', '.ts-message')
        const data = msgNode.find('profile-picture').data('tid').split(':')
        replyId = data[data.length - 1]
      }

      // Find Mentions
      const mentions = []
      JQTextBox.find('span[data-itemprops]').each(function () {
        const jqElem = jQuery(this)
        const mentionData = jqElem.data('itemprops')
        if (mentionData?.mentionType === 'person') {
          const data = mentionData.mri.split(':')
          mentions.push(data[data.length - 1])
        }
      })

      // Return text of message with mentions
      const tree = jQuery.parseHTML(event.target.innerHTML)
      if (!Array.isArray(tree)) {
        return [event.target.textContent, mentions, replyId]
      } else {
        const text = []
        tree.forEach((div) => { text.push(div.textContent) })
        return [text.join('\n'), mentions, replyId]
      }
    }

    case CONTEXT.DISCORD: {
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
      return [event.target.textContent, mentions, '']
    }

    default:
      console.log('Unsupported context:', contextName)
      break
  }
}

export function sendTextToServer (newText, mentions = [], replyId) {
  if (this.backgroundPort) {
    this.backgroundPort.postMessage({
      type: 'textUpdate',
      context: this.contextName,
      content: newText,
      mentions,
      replyId
    })
  }
}
