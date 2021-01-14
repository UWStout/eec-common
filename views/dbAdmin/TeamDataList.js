/* global $ */

// Import parent and list-group building methods
import DataList from './DataList.js'

export default class TeamDataList extends DataList {
  constructor (sortFilterOptions, upperNavElem, lowerNavElem, dataListElem) {
    super(sortFilterOptions, 'team', upperNavElem, lowerNavElem,
      dataListElem, sortFilterOptions[0].text, sortFilterOptions[0].value)
    this.editButtonClassName = 'teamEditButton'
  }

  makeListItem (team, key) {
    // Build text elements
    const nameElem = $('<h5>').addClass('mb-1')
    nameElem.text(`${team.name}${team.unitName ? ' (in org ' + team.unitName + ')' : ''}`)
    const idElem = $('<small>').text(`(${team._id})`)

    // Inner formatting div
    const innerDiv = $('<div>').addClass('d-flex w-100 justify-content-between')
    innerDiv.append(nameElem, idElem)

    // Outer list-group-item a tag
    const outerElem = $('<a>').addClass('list-group-item list-group-item-action teamEditButton').attr('href', '#')
    outerElem.attr('data-index', key)
    outerElem.append(innerDiv)
    return outerElem
  }
}
