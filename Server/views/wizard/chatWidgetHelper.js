/* globals $ */

export function makeTabHeader (id, userID, contextName, isActive, tabShownCallback) {
  // Make tab text
  const text = `${userID} - ${contextName}`

  // Build elements
  const tabListItem = $('<li></li>').addClass('nav-item')
  const tabLink = $('<a></a>').addClass('nav-link text-truncate')

  // Configure tab-link element
  tabLink.attr('id', `tab${id}`).attr('href', `#tab${id}Content`)
  tabLink.attr('roll', 'tab').attr('data-toggle', 'tab')
  tabLink.attr('aria-controls', `tab${id}Content`)
  tabLink.text(text)
  if (isActive) {
    tabLink.addClass('active')
    tabLink.attr('aria-selected', 'true')
  }

  // Register the CB
  tabLink.on('shown.bs.tab', () => { tabShownCallback(id, userID, contextName) })

  // Assemble and return
  tabListItem.append(tabLink)
  return tabListItem
}

export function makeTabContentPane (id, clientID, contextName, isActive) {
  // Make outmost tab content pane div
  const tabPaneDiv = $('<div></div>').addClass('tab-pane fade')
  if (isActive) {
    tabPaneDiv.addClass('show active')
  }
  tabPaneDiv.attr('id', `tab${id}Content`)
  tabPaneDiv.attr('role', 'tabpanel')
  tabPaneDiv.attr('aria-labelledby', `tab${id}`)
  tabPaneDiv.css('height', '310px')

  // Make inner containers for proper grid and formatting
  const paneChild1 = $('<div></div>').addClass('container h-100')
  const paneChild2 = $('<div></div>').addClass('mt-2 mb-4 h-100')

  // Add chat widget at inner-most child
  paneChild2.append(makeChatWidget(id, clientID, contextName))

  // Assemble hierarchy and return root
  tabPaneDiv.append(paneChild1)
  paneChild1.append(paneChild2)
  return tabPaneDiv
}

function makeChatWidget (id, clientID, contextName) {
  const chatWidgetInnerHTML = `
    <!-- Chat Interface Widget -->
    <ul class="messageList" id="messageList${id}"></ul>
    <div class="activeTyping" id="activeTyping${id}"></div>
    `
  const chatWidget = $.parseHTML(chatWidgetInnerHTML)
  return chatWidget
}
