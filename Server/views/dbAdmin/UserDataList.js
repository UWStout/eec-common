// Import parent and list-group building methods
import DataList from './DataList.js'
import { makeListGroup, makeUserListItem } from './listGroupItems.js'

export default class UserDataList extends DataList {
  constructor (sortFilterOptions, upperNavElem, lowerNavElem, dataListElem) {
    super(sortFilterOptions, 'user', upperNavElem, lowerNavElem,
      dataListElem, sortFilterOptions[0].text, sortFilterOptions[0].value)
    this.editButtonClassName = 'userEditButton'
  }

  // Rebuild the central table
  rebuildTable () {
    // Do nothing without a dataListElem
    if (!this.dataListElem) { return }

    // Remake the table
    const dataList = makeListGroup(this.data, makeUserListItem)
    this.dataListElem.empty().append(dataList)
  }
}
