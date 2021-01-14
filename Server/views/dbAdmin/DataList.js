/* global $, EventEmitter3 */

// Various helper functions
import { makePageNavBar, makeFilterSortBar } from './pageNav.js'
import { retrieveList } from './dbManagement.js'

/**
 * A 'widget' that shows a list of data along with bars that allow control of
 * pagination, sorting, filtering, and click events.
 */
export default class DataList extends EventEmitter3 {
  constructor (sortFilterOptions, collectionName, upperNavElem, lowerNavElem,
    dataListElem, defaultFilterByText = '', defaultFilterBy = '') {
    super()

    // HTML elements for the various internal widgets
    this.upperNavElem = upperNavElem
    this.lowerNavElem = lowerNavElem
    this.dataListElem = dataListElem

    if (!this.dataListElem) {
      console.err('ERROR: "dataListElem" for DataList cannot be null')
      return
    }

    // Collection name and select options
    this.collectionName = collectionName
    this.sortFilterOptions = sortFilterOptions
    this.editButtonClassName = 'editButton'

    // Pagination variables
    this.totalItems = 0
    this.page = 1
    this.perPage = 25
    this.pageCount = 1

    // Sort variables
    this.sortBy = ''
    this.sortOrder = 1

    // Filter variables
    this.filterByText = defaultFilterByText
    this.filterBy = defaultFilterBy
    this.filter = ''

    // Local copy of most recently retrieved data
    this.data = []

    // Setup update and rebuild callbacks
    this.on('update', this.retrieveData.bind(this))
    this.on('updateSuccess', () => {
      this.rebuildTable()
      this.rebuildNav()
      this.setEventCallbacks()
    })
  }

  // Return a stored item
  getItem (index) {
    if (index >= 0 && index < this.data.length) {
      return this.data[index]
    }

    return null
  }

  // Update data (and if successful, rebuild widget)
  update () { this.retrieveData() }

  // Retrieve data using AJAX
  async retrieveData () {
    // Do nothing without a dataListElem
    if (!this.dataListElem) { return }

    try {
      // Retrieve the latest user data
      const response = await retrieveList(
        this.collectionName, this.page, this.perPage,
        this.sortBy, this.sortOrder, this.filterBy, this.filter)

      // Cache returned data for local use
      this.totalItems = response.count
      this.data = response.data
      this.emit('updateSuccess')
    } catch (err) {
      // Handle error
      console.log('Error retrieving list data:')
      console.log(err)
      this.emit('updateFailed')
    }
  }

  // Rebuild the central table
  rebuildTable () {
    console.error('Abstract "DataList.rebuildTable()" called')
  }

  // Rebuild the navigation bars
  rebuildNav () {
    // Don't proceed unless one of the nav bars is enabled
    if (!this.upperNavElem && !this.lowerNavElem) {
      return
    }

    // Rebuild the nav bars
    const pageCount = Math.ceil(this.totalItems / this.perPage)
    if (this.upperNavElem) {
      const upperPageNav = makePageNavBar(pageCount, this.page, 'upper')
      const upperFilterSortBar = makeFilterSortBar(this.sortFilterOptions, 'upper')
      this.upperNavElem.empty().append([...upperPageNav, ...upperFilterSortBar])
    }

    if (this.lowerNavElem) {
      const lowerPageNav = makePageNavBar(pageCount, this.page, 'lower')
      const lowerFilterSortBar = makeFilterSortBar(this.sortFilterOptions, 'lower')
      this.lowerNavElem.empty().append([...lowerPageNav, ...lowerFilterSortBar])
    }

    // Swap order icons
    if (this.sortOrder === -1) {
      const sortButtons = $('.fa-sort-amount-up')
      sortButtons.removeClass('fa-sort-amount-up')
      sortButtons.addClass('fa-sort-amount-down')
    }

    // Set values for all inputs
    $('.perPageSelect').val(this.perPage)
    $('.sortBySelect').val(this.sortBy)

    $('.filterByDropdown').text(this.filterByText)
    $('.filterTextInput').val(this.filter)

    // Update page link status (disabled/active)
    $('.page-item[data-which="More"]').addClass('disabled')
    if (this.page === 1) {
      $('.page-item[data-which="Previous"]').addClass('disabled')
    }
    if (this.page === this.pageCount) {
      $('.page-item[data-which="Next"]').addClass('disabled')
    }
    $(`.page-item[data-which="${this.page}"]`).addClass('active')
  }

  // Setup callbacks for all the internal click and on-change events
  setEventCallbacks () {
    // Don't proceed unless one of the nav bars is enabled
    if (!this.upperNavElem && !this.lowerNavElem) {
      return
    }

    // Reference to self for use in callbacks
    const self = this

    // Setup all the proper click callbacks
    $(`.${self.editButtonClassName}`).click((e) => {
      e.preventDefault()
      const index = parseInt($(e.currentTarget).data('index'))
      if (isNaN(index)) {
        console.error(`Bad index for edit button (${$(e.currentTarget).data('index')})`)
      } else {
        self.emit('editRequested', index, self.getItem(index))
      }
    })

    $('.page-link').click((e) => {
      e.preventDefault()

      // Decode page number info
      const dataWhich = $(e.currentTarget).data('which')
      let newPage = self.page
      switch (dataWhich) {
        case 'Previous': newPage--; break
        case 'Next': newPage++; break
        default: newPage = parseInt(dataWhich); break
      }

      // Clamp page number and rebuild
      self.page = Math.max(1, Math.min(self.pageCount, newPage))
      self.emit('update')
    })

    $('.sortOrderButton').click((e) => {
      e.preventDefault()
      self.sortOrder = (-self.sortOrder)
      self.emit('update')
    })
    $('.filterByLink').click((e) => {
      e.preventDefault()
      self.filterByText = $(e.currentTarget).text()
      self.filterBy = $(e.currentTarget).data('value')
      console.log(`Filter By Update: ${self.filterByText}/${self.filterBy}`)
      self.emit('update')
    })

    // Setup proper on-change callbacks
    $('.perPageSelect').on('change', (e) => {
      e.preventDefault()
      self.perPage = parseInt($(e.currentTarget).val())
      self.emit('update')
    })

    $('.sortBySelect').on('change', (e) => {
      self.sortBy = $(e.currentTarget).val()
      self.emit('update')
    })

    $('.filterTextInput').on('change', (e) => {
      e.preventDefault()
      self.filter = $(e.currentTarget).val()
      console.log(`Filtering: ${self.filter}`)
      self.emit('update')
    })
  }
}
