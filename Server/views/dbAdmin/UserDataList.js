/* global $ */

// Import parent and list-group building methods
import DataList from './DataList.js'

export default class UserDataList extends DataList {
  constructor (sortFilterOptions, upperNavElem, lowerNavElem, dataListElem) {
    super(sortFilterOptions, 'user', upperNavElem, lowerNavElem,
      dataListElem, sortFilterOptions[0].text, sortFilterOptions[0].value)
    this.editButtonClassName = 'userEditButton'
  }

  makeListItem (user, key) {
    // Build text elements
    const nameElem = $('<h5>').addClass('mb-1').text(`${user.lastName}, ${user.firstName} (${user.email})`)
    const idElem = $('<small>').text(`${user._id}`)

    // Inner formatting div
    const innerDiv = $('<div>').addClass('d-flex w-100 justify-content-between')
    innerDiv.append(nameElem, idElem)

    // Outer list-group-item a tag
    const outerElem = $('<a>').addClass('list-group-item list-group-item-action userEditButton').attr('href', '#')
    outerElem.attr('data-index', key)
    outerElem.append(innerDiv)
    return outerElem
  }
}
