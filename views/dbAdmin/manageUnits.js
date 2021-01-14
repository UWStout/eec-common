/* global $ */

import DataList from './UnitDataList.js'

// The central dataList element
let dataList = null

// Sort by options shown in the full nav bar
const userSortByOptions = [
  { text: 'Unit Name', value: 'name' },
  { text: 'ID', value: '_id' }
]

$(document).ready(() => {
  // Build the DataList object
  dataList = new DataList(
    userSortByOptions, $('#upperPageNav'), $('#lowerPageNav'), $('#unitList')
  )

  // Callback for editing
  dataList.on('editRequested', showUnitEditModal)

  // Trigger the initial update
  dataList.update()
})

function showUnitEditModal (index, unitObject) {
  // Set modal title
  $('#unitEditModalTitle').text(`Editing '${unitObject.name}'`)

  // Customize the form
  $('#nameInput').val(unitObject.name)

  // Show the modal
  $('#unitEditModal').modal()
}
