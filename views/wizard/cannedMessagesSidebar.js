/* global $ */

export function makeMessageGroup (groupIndex, clickCallback, parentID, headerText, choices) {
  const headingID = `messageGroupHeading${groupIndex}`
  const collapseID = `messageGroupCollapse${groupIndex}`
  const listID = `messageGroupList${groupIndex}`

  const cardDiv = $('<div>').addClass('card')
  cardDiv.append(
    makeCardHeader(headerText, headingID, collapseID),
    makeCardBody(choices, clickCallback, headingID, collapseID, listID, parentID)
  )

  return cardDiv
}

function makeCardHeader (headerText, headingID, collapseID) {
  // Build the outer container tags
  const headerDiv = $('<div>').attr('id', headingID).addClass('card-header p-0')
  const headerTxt = $('<h2>').addClass('mb-0')

  // Build the central button with text
  const headerBtn = $('<button>').attr('type', 'button').addClass('btn btn-link collapsed')
  headerBtn.attr('data-toggle', 'collapse').attr('data-target', '#' + collapseID)
  headerBtn.attr('aria-expanded', false).attr('aria-controls', collapseID)
  headerBtn.css('margin-top', '-10px').css('width', '100%').css('text-align', 'left')
  headerBtn.text(headerText)

  // Assemble and return
  headerTxt.append(headerBtn)
  headerDiv.append(headerTxt)
  return headerDiv
}

function makeCardBody (choices, clickCB, headingID, collapseID, listID, parentID) {
  const bodyCollapseDiv = $('<div>').attr('id', collapseID).addClass('collapse')
  bodyCollapseDiv.attr('data-parent', '#' + parentID).attr('aria-labelledby', headingID)

  const bodyCardDiv = $('<div>').addClass('card-body py-1')
  const bodyListGroup = makeListGroup(choices, clickCB, listID)

  bodyCardDiv.append(bodyListGroup)
  bodyCollapseDiv.append(bodyCardDiv)
  return bodyCollapseDiv
}

function makeListGroup (choices, clickCB, listID) {
  const listGroupUL = $('<ul>').attr('id', listID).addClass('list-group list-group-flush')

  choices.forEach((choice) => {
    const choiceItem = $('<li>').addClass('list-group-item px-0 py-1').text(choice.name ? choice.name : 'ERROR: \'name\' property missing')
    choiceItem.attr('data-message', choice.message ? choice.message : 'ERROR: \'message\' property missing from choice')
    choiceItem.attr('data-overwrite', choice.overwrite !== undefined ? choice.overwrite : false)
    choiceItem.css('cursor', 'pointer')
    // choiceItem.attr('data-action', choice.action)
    choiceItem.click(clickCB)
    listGroupUL.append(choiceItem)
  })

  return listGroupUL
}
