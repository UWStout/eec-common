// Import parent and list-group building methods
import DataList from './DataList.js'
import { makeListGroup, makeTeamListItem } from './listGroupItems.js'

export default class TeamDataList extends DataList {
  constructor (sortFilterOptions, upperNavElem, lowerNavElem, dataListElem) {
    super(sortFilterOptions, 'team', upperNavElem, lowerNavElem,
      dataListElem, sortFilterOptions[0].text, sortFilterOptions[0].value)
    this.editButtonClassName = 'teamEditButton'
  }

  // Rebuild the central table
  rebuildTable () {
    // Do nothing without a dataListElem
    if (!this.dataListElem) { return }

    // Remake the table
    const dataList = makeListGroup(this.data, makeTeamListItem)
    this.dataListElem.empty().append(dataList)
  }
}
