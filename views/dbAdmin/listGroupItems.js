/* global $ */

export function makeListGroup (items, makeItemCallback) {
  // Build list group and append all items
  const listGroupElem = $('<div>').addClass('list-group')
  items.forEach((item) => {
    listGroupElem.append(makeItemCallback(item))
  })

  // Build outer grid column, append, and return
  const outerElem = $('<div>').addClass('col-12')
  outerElem.append(listGroupElem)
  return outerElem
}

export function makeUserListItem (user) {
  // Build text elements
  const nameElem = $('<h5>').addClass('mb-1').text(`${user.lastName}, ${user.firstName} (${user.email})`)
  const idElem = $('<small>').text(`${user._id}`)

  // Inner formatting div
  const innerDiv = $('<div>').addClass('d-flex w-100 justify-content-between')
  innerDiv.append(nameElem, idElem)

  // Outer list-group-item a tag
  const outerElem = $('<a>').addClass('list-group-item list-group-item-action').attr('href', '#')
  outerElem.append(innerDiv)
  return outerElem
}

export function makeTeamListItem (team) {
  // Build text elements
  const nameElem = $('<h5>').addClass('mb-1').text(`${team.name} (${team._id})`)
  const idElem = $('<small>').text(`${team.unit.name} (${team.unit._id})`)

  // Inner formatting div
  const innerDiv = $('<div>').addClass('d-flex w-100 justify-content-between')
  innerDiv.append(nameElem, idElem)

  // Outer list-group-item a tag
  const outerElem = $('<a>').addClass('list-group-item list-group-item-action').attr('href', '#')
  outerElem.append(innerDiv)
  return outerElem
}
