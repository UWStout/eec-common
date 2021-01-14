/* global $ */

// Import parent and list-group building methods
import DataList from './DataList.js'

export default class UnitDataList extends DataList {
  constructor (sortFilterOptions, upperNavElem, lowerNavElem, dataListElem) {
    super(sortFilterOptions, 'unit', upperNavElem, lowerNavElem,
      dataListElem, sortFilterOptions[0].text, sortFilterOptions[0].value)
    this.editButtonClassName = 'unitEditButton'
  }

  makeListItem (unit, key) {
    // Build text elements
    const nameElem = $('<h5>').addClass('mb-1')
    nameElem.text(`${unit.name}`)
    const idElem = $('<small>').text(`(${unit._id})`)

    // Inner formatting div
    const innerDiv = $('<div>').addClass('d-flex w-100 justify-content-between')
    innerDiv.append(nameElem, idElem)

    // Outer list-group-item a tag
    const outerElem = $('<a>').addClass('list-group-item list-group-item-action unitEditButton').attr('href', '#')
    outerElem.attr('data-index', key)
    outerElem.append(innerDiv)
    return outerElem
  }
}
