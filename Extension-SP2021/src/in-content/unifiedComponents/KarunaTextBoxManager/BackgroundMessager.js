import { CONTEXT } from '../../../util/contexts'

export function updateMessageText (event, JQTextBox, contextName) {
  // Send changed text to the server
  switch (contextName) {
    case CONTEXT.MS_TEAMS: {
      // Is this a reply (and to whom)
      let replyId = ''
      let isCollapsed = false

      const idList = new Set()
      const participants = []
      if (JQTextBox.attr('aria-label').includes('Reply')) {
        // Locate the avatar profile pictures
        const msgNode = JQTextBox.parentsUntil('.ts-expanded-message', '.ts-message')
        const pics = msgNode.find('profile-picture')

        // The first one is the person who started the thread
        if (pics.length > 0) {
          let data = jQuery(pics[0]).data('tid').split(':')
          replyId = data[data.length - 1]
          idList.add(replyId)

          // The rest are other's who have replied
          if (pics.length > 1) {
            for (let i = 1; i < pics.length; i++) {
              data = jQuery(pics[i]).data('tid').split(':')
              if (!idList.has(data[data.length - 1])) {
                participants.unshift(data[data.length - 1])
                idList.add(data[data.length - 1])
              }
            }
          }
        }

        // Check if the reply thread is collapsed (e.g. we can't see who's participating)
        const collapsedCount = msgNode.find('.conversation-collapsed').length
        const notCollapsedCount = msgNode.find('.conversation-not-collapsed').length
        isCollapsed = (collapsedCount > 0 && notCollapsedCount <= 1)
      } else {
        // Build conversation participation list from profile-pictures in the main message list
        jQuery('message-list profile-picture').each((i, elem) => {
          const data = jQuery(elem).data('tid').split(':')
          if (!idList.has(data[data.length - 1])) {
            participants.unshift(data[data.length - 1])
            idList.add(data[data.length - 1])
          }
        })
      }

      // Include only the last 5 participants
      participants.splice(5)

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
        return [event.target.textContent, mentions, participants, replyId, isCollapsed]
      } else {
        const text = []
        tree.forEach((div) => { text.push(div.textContent) })
        return [text.join('\n'), mentions, participants, replyId, isCollapsed]
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

      // Find other participants
      const idList = new Set()
      const participants = []
      jQuery('[class*="chatContent"] img[class*="avatar"]').each((i, elem) => {
        const match = jQuery(elem).attr('src').match(/avatars\/(.*)\//i)
        if (Array.isArray(match) && match.length > 1) {
          if (!idList.has(match[1])) {
            participants.unshift(match[1])
            idList.add(match[1])
          }
        }
      })

      // Include only last 5
      participants.splice(5)

      // Return text of message with mentions and participants
      return [event.target.textContent, mentions, participants, '', false]
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
