/* global $ */

import DataList from './UserDataList.js'

// The central dataList element
let dataList = null

// Sort by options shown in the full nav bar
const userSortByOptions = [
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  { text: 'e-mail', value: 'email' },
  { text: 'ID', value: '_id' }
]

$(document).ready(() => {
  // Build the DataList object
  dataList = new DataList(
    userSortByOptions, $('#upperPageNav'), $('#lowerPageNav'), $('#userList')
  )

  // Callback for editing
  dataList.on('editRequested', showUserEditModal)

  // Trigger the initial update
  dataList.update()
})

function showUserEditModal (index, userObject) {
  // Set modal title
  $('#userEditModalTitle').text(`Editing '${userObject.firstName} ${userObject.lastName}'`)

  // Customize the form
  $('#firstNameInput').val(userObject.firstName)
  $('#lastNameInput').val(userObject.lastName)
  $('#emailInput').val(userObject.email)
  $('#userTypeInput').val(userObject.userType)

  // Show the modal
  $('#userEditModal').modal()
}
