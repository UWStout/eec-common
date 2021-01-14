/* global $ */

import DataList from './TeamDataList.js'

// The central dataList element
let dataList = null

// Sort by options shown in the full nav bar
const teamSortFilterOptions = [
  { text: 'Team Name', value: 'name' },
  { text: 'Team ID', value: '_id' },
  { text: 'Org Unit Name', value: 'unitName' },
  { text: 'Org Unit ID', value: 'orgId' }
]

$(document).ready(() => {
  // Build the DataList object
  dataList = new DataList(
    teamSortFilterOptions, $('#upperPageNav'), $('#lowerPageNav'), $('#teamList')
  )

  // Callback for editing
  dataList.on('editRequested', showTeamEditModal)

  // Trigger the initial update
  dataList.update()
})

function showTeamEditModal (index, teamObject) {
  // Set modal title
  $('#teamEditModalTitle').text(`Editing '${teamObject.name}'`)

  // Customize the form
  $('#nameInput').val(teamObject[index].name)
  $('#orgUnitInput').val(teamObject[index].orgId)

  // Show the modal
  $('#teamEditModal').modal()
}
