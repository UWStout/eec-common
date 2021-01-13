/* global $ */

import { makePageNavBar, makeFilterSortBar } from './pageNav.js'
import { makeListGroup, makeUserListItem } from './listGroupItems.js'
import { retrieveList } from './dbManagement.js'

// Sort by options shown in the full nav bar
const userSortByOptions = [
  { text: 'Last Name', value: 'lastName' },
  { text: 'First Name', value: 'firstName' },
  { text: 'e-mail', value: 'email' },
  { text: 'ID', value: '_id' }
]

// Global pagination variables
let gTotalUsers = 6
let gPage = 1
let gPerPage = 25
let gPageCount = 1

// Global sort variables
let gSortBy = ''
let gSortOrder = 1

// Global filter variables
let gFilterByText = 'Last Name'
let gFilterBy = 'lastName'
let gFilter = ''

// Global user data
let gUserData = []

// Build page structure and table
$(document).ready(() => {
  // Build the initial data
  rebuildPage(gPage, gPerPage, gSortBy, gSortOrder, gFilterBy, gFilter)
})

function rebuildPage (page, perPage, sortBy, sortOrder, filterBy, filter) {
  return new Promise((resolve, reject) => {
    // Retrieve the new user data
    retrieveList('user', page, perPage, sortBy, sortOrder, filterBy, filter)
      .then((response) => {
        // Update global values
        gPage = page
        gPerPage = perPage
        gTotalUsers = response.count
        gPageCount = Math.ceil(gTotalUsers / gPerPage)

        gSortBy = sortBy
        gSortOrder = sortOrder

        gFilterBy = filterBy
        gFilter = filter

        // Re-make the central data list
        gUserData = response.data
        const dataList = makeListGroup(gUserData, makeUserListItem)
        $('#userList').empty().append(dataList)

        // Rebuild the nav bars
        const upperPageNav = makePageNavBar(gPageCount, gPage, 'upper')
        const upperFilterSortBar = makeFilterSortBar(userSortByOptions, 'upper')
        $('#upperPageNav').empty().append([...upperPageNav, ...upperFilterSortBar])

        const lowerPageNav = makePageNavBar(gPageCount, gPage, 'lower')
        const lowerFilterSortBar = makeFilterSortBar(userSortByOptions, 'lower')
        $('#lowerPageNav').empty().append([...lowerPageNav, ...lowerFilterSortBar])

        // Swap order icons
        if (gSortOrder === -1) {
          const sortButtons = $('.fa-sort-amount-up')
          sortButtons.removeClass('fa-sort-amount-up')
          sortButtons.addClass('fa-sort-amount-down')
        }

        // Set values for all inputs
        $('.perPageSelect').val(gPerPage)
        $('.sortBySelect').val(gSortBy)

        $('.filterByDropdown').text(gFilterByText)
        $('.filterTextInput').val(gFilter)

        // Setup all the proper click callbacks
        $('.page-link').click(changePage)
        $('.sortOrderButton').click(changeSortOrder)
        $('.userEditButton').click(showUserEditModal)
        $('.filterByLink').click(changeFilterBy)

        // Setup proper on-change callbacks
        $('.perPageSelect').on('change', changePerPage)
        $('.sortBySelect').on('change', changeSortBy)
        $('.filterTextInput').on('change', changeFilter)

        // Update page link status (disabled/active)
        $('.page-item[data-which="More"]').addClass('disabled')
        if (gPage === 1) {
          $('.page-item[data-which="Previous"]').addClass('disabled')
        }
        if (gPage === gPageCount) {
          $('.page-item[data-which="Next"]').addClass('disabled')
        }
        $(`.page-item[data-which="${gPage}"]`).addClass('active')

        // Resolve the promise
        return resolve()
      }).catch((err) => {
        reject(err)
      })
  })
}

function changePage (event) {
  event.preventDefault()

  // Decode page number info
  const dataWhich = $(event.currentTarget).data('which')
  let newPage = gPage
  switch (dataWhich) {
    case 'Previous': newPage--; break
    case 'Next': newPage++; break
    default: newPage = parseInt(dataWhich); break
  }

  // Clamp page number and rebuild
  newPage = Math.max(1, Math.min(gPageCount, newPage))
  rebuildPage(newPage, gPerPage, gSortBy, gSortOrder, gFilterBy, gFilter)
}

function changePerPage (event) {
  event.preventDefault()
  const newPerPage = parseInt($(event.currentTarget).val())
  rebuildPage(gPage, newPerPage, gSortBy, gSortOrder, gFilterBy, gFilter)
}

function changeSortBy (event) {
  event.preventDefault()
  const newSortBy = $(event.currentTarget).val()
  rebuildPage(gPage, gPerPage, newSortBy, gSortOrder, gFilterBy, gFilter)
}

function changeSortOrder (event) {
  event.preventDefault()
  const newSortOrder = (-gSortOrder)
  rebuildPage(gPage, gPerPage, gSortBy, newSortOrder, gFilterBy, gFilter)
}

function changeFilterBy (event) {
  event.preventDefault()
  gFilterByText = $(event.currentTarget).text()
  const newFilterBy = $(event.currentTarget).data('value')
  rebuildPage(gPage, gPerPage, gSortBy, gSortOrder, newFilterBy, gFilter)
}

function changeFilter (event) {
  event.preventDefault()
  const newFilter = $(event.currentTarget).val()
  rebuildPage(gPage, gPerPage, gSortBy, gSortOrder, gFilterBy, newFilter)
}

function showUserEditModal (event) {
  event.preventDefault()

  // Get index of the relevant user data
  const index = $(event.currentTarget).data('index')

  // Set modal title
  $('#modalTitle').text(`Editing '${gUserData[index].firstName} ${gUserData[index].lastName}'`)

  // Customize the form
  $('#firstNameInput').val(gUserData[index].firstName)
  $('#lastNameInput').val(gUserData[index].lastName)
  $('#emailInput').val(gUserData[index].email)
  $('#userTypeInput').val(gUserData[index].userType)

  // Show the modal
  $('#userEditModal').modal()
}
