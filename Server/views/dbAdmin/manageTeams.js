/* global $ */

import { makeFullNavBar } from './pageNav.js'
import { makeListGroup, makeTeamListItem } from './listGroupItems.js'
import { retrieveTeams } from './dbManagement.js'

// Sort by options shown in the full nav bar
const teamSortByOptions = [
  { text: 'Team Name', value: 'teamName' },
  { text: 'Team ID', value: 'teamID' },
  { text: 'Org Unit Name', value: 'orgUnitName' },
  { text: 'Org Unit ID', value: 'orgUnitID' }
]

// Global page and perPage variables
const page = 1
const perPage = 25

// Build page structure and table
$(document).ready(async () => {
  // Build upper nav bar
  const upperNavCols = makeFullNavBar(3, teamSortByOptions, 'upper')
  $('#upperNav').append(upperNavCols)

  // Build central data list
  const teamList = await retrieveTeams(page, perPage)
  const dataList = makeListGroup(teamList, makeTeamListItem)
  $('#teamList').empty()
  $('#teamList').append(dataList)

  // Build lower nav bar
  const lowerNavCols = makeFullNavBar(3, teamSortByOptions, 'lower')
  $('#lowerNav').append(lowerNavCols)
})
