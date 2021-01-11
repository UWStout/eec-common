/* global $ */

import { makeFullNavBar } from './pageNav.js'
import { makeListGroup, makeUserListItem } from './listGroupItems.js'
import { retrieveUsers } from './dbManagement.js'

// Sort by options shown in the full nav bar
const userSortByOptions = [
  { text: 'First Name', value: 'firstName' },
  { text: 'Last Name', value: 'lastName' },
  { text: 'e-mail', value: 'email' },
  { text: 'ID', value: 'id' }
]

// Global page and perPage variables
const page = 1
const perPage = 25

// Build page structure and table
$(document).ready(async () => {
  // Build upper nav bar
  const upperNavCols = makeFullNavBar(3, userSortByOptions, 'upper')
  $('#upperNav').append(upperNavCols)

  // Build central data list
  const userList = await retrieveUsers(page, perPage)
  const dataList = makeListGroup(userList, makeUserListItem)
  $('#userList').empty()
  $('#userList').append(dataList)

  // Build lower nav bar
  const lowerNavCols = makeFullNavBar(3, userSortByOptions, 'lower')
  $('#lowerNav').append(lowerNavCols)
})
