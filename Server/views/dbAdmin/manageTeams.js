/* global $ */

import { makePageNavBar, makeFilterSortBar } from './pageNav.js'
import { makeListGroup, makeTeamListItem } from './listGroupItems.js'
import { retrieveList } from './dbManagement.js'

// Sort by options shown in the full nav bar
const teamSortByOptions = [
  { text: 'Team Name', value: 'teamName' },
  { text: 'Team ID', value: '_id' },
  { text: 'Org Unit ID', value: 'orgId' }
]

// Global pagination variables
let gTotalTeams = 6
let gPage = 1
let gPerPage = 25
let gPageCount = 1

// Global sort variables
let gSortBy = ''
let gSortOrder = 1

// Global filter variables
let gFilterByText = 'Team Name'
let gFilterBy = 'name'
let gFilter = ''

// Global team data
let gTeamData = []

// Build page structure and table
$(document).ready(() => {
  // Build the initial data
  rebuildPage(gPage, gPerPage, gSortBy, gSortOrder, gFilterBy, gFilter)
})

function rebuildPage (page, perPage, sortBy, sortOrder, filterBy, filter) {
  return new Promise((resolve, reject) => {
    // Retrieve the new user data
    retrieveList('team', page, perPage, sortBy, sortOrder, filterBy, filter)
      .then((values) => {
        // Update global values
        gPage = page
        gPerPage = perPage
        gTotalTeams = 1000
        gPageCount = Math.ceil(gTotalTeams / gPerPage)

        gSortBy = sortBy
        gSortOrder = sortOrder

        gFilterBy = filterBy
        gFilter = filter

        // Re-make the central data list
        gTeamData = values
        const dataList = makeListGroup(gTeamData, makeTeamListItem)
        $('#teamList').empty().append(dataList)

        // Rebuild the nav bars
        const upperPageNav = makePageNavBar(gPageCount, gPage, 'upper')
        const upperFilterSortBar = makeFilterSortBar(teamSortByOptions, 'upper')
        $('#upperPageNav').empty().append([...upperPageNav, ...upperFilterSortBar])

        const lowerPageNav = makePageNavBar(gPageCount, gPage, 'lower')
        const lowerFilterSortBar = makeFilterSortBar(teamSortByOptions, 'lower')
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
        $('.teamEditButton').click(showTeamEditModal)
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
      })
      .catch((err) => {
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

function showTeamEditModal (event) {
  event.preventDefault()

  // Get index of the relevant user data
  const index = $(event.currentTarget).data('index')

  // Set modal title
  $('#teamEditModalTitle').text(`Editing '${gTeamData[index].name}'`)

  // Customize the form
  $('#nameInput').val(gTeamData[index].name)
  $('#orgUnitInput').val(gTeamData[index].orgId)

  // Show the modal
  $('#teamEditModal').modal()
}
