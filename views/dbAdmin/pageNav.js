/* global $ */

// Values for the per-page select
const PER_PAGE_OPTIONS = [
  25, 50, 100, 250
]

// Max number of page buttons
const PAGE_BTN_MAX = 8

/**
 * Create the pagination nav bar element for display above/below the list of page-able data
 * @param {number} pages Number of page buttons to include
 * @param {number} curPage The currently active page
 * @param {string} idPrefix Prefix to apply to the input IDs (defaults to empty string)
 * @return {JQueryElement} Full nav bar element created with JQuery
 */
export function makePageNavBar (pages, curPage, idPrefix = '') {
  // The three main columns of the page nav bar
  const col1 = $('<div>').addClass('col-12 col-md-9 col-lg-8').append(makePageNav(pages, curPage))

  const perPageSelect = makePerPageSelect(idPrefix + 'PerPageInput', 'Per Page:')
  const col2 = $('<div>').addClass('col-12 col-md-3 col-lg-4').append(perPageSelect)

  // Return both columns
  return [col1, col2]
}

/**
 * Create the filter and sort element for display above/below the list data
 * @param {Array(Object)} sortFilterOptions Array of objects with 'text' and 'value' props for sort-by select
 * @param {string} idPrefix Prefix to apply to the input IDs (defaults to empty string)
 * @return {JQueryElement} Full nav bar element created with JQuery
 */
export function makeFilterSortBar (sortFilterOptions, idPrefix = '') {
  const filterByInput = makeFilterByInput(sortFilterOptions, 'Filter:', idPrefix + 'FilterInput')
  const col1 = $('<div>').addClass('col-12 col-md-6').append(filterByInput)

  const sortBySelect = makeSortBySelect('Sort By:', idPrefix + 'SortByInput', sortFilterOptions)
  const col2 = $('<div>').addClass('col-12 col-md-6').append(sortBySelect)

  // Return both columns
  return [col1, col2]
}

/**
 * Create a Bootstrap pagination element with prev and next buttons
 * @param {number} pages How many page buttons to include (minimum 1)
 */
function makePageNav (pages, curPage) {
  // Add previous button
  const paginationUL = $('<ul>').addClass('pagination my-1')
  paginationUL.append(makePageButton('&laquo;', 'Previous'))

  // Don't make too many page buttons
  if (pages <= PAGE_BTN_MAX) {
    // No abbreviation needed, just make page buttons
    for (let page = 1; page <= pages; page++) {
      paginationUL.append(makePageButton(page))
    }
  } else {
    const btnDist = PAGE_BTN_MAX - 2
    if (curPage < btnDist) {
      // First few pages
      for (let page = 1; page <= btnDist; page++) {
        paginationUL.append(makePageButton(page))
      }
      paginationUL.append(makePageButton('…', 'More'))
      paginationUL.append(makePageButton(pages))
    } else if (curPage > pages - btnDist + 1) {
      // Last few pages
      paginationUL.append(makePageButton(1))
      paginationUL.append(makePageButton('…', 'More'))
      for (let page = pages - btnDist + 1; page <= pages; page++) {
        paginationUL.append(makePageButton(page))
      }
    } else {
      // Some middle pages
      const startPage = curPage - Math.floor((btnDist - 2) / 2)
      const endPage = startPage + (btnDist - 3)
      paginationUL.append(makePageButton(1))
      paginationUL.append(makePageButton('…', 'More'))
      for (let page = startPage; page <= endPage; page++) {
        paginationUL.append(makePageButton(page))
      }
      paginationUL.append(makePageButton('…', 'More'))
      paginationUL.append(makePageButton(pages))
    }
  }

  // Add next button
  paginationUL.append(makePageButton('&raquo;', 'Next'))
  const navElem = $('<nav>').attr('aria-label', 'Page Navigation').append(paginationUL)

  return navElem
}

/**
 * Create a button for inclusion in a bootstrap pagination element
 * @param {string} text Text for the button
 * @param {string} ariaLabel Text to set for the aria label (causes button content to be aria-hidden)
 */
function makePageButton (text, ariaLabel) {
  // Make inner 'a' link tag
  const linkElem = $('<a>').addClass('page-link').attr('href', '#').attr('data-which', ariaLabel || text)
  if (ariaLabel) {
    linkElem.attr('aria-label', ariaLabel)
    const hiddenSpan = $('<span>').attr('aria-hidden', 'true').html(text)
    linkElem.append(hiddenSpan)
  } else {
    linkElem.html(text)
  }

  // Make and return li tag
  const widthPercent = 100 / (PAGE_BTN_MAX + 2)
  const liElem = $('<li>').addClass('page-item text-center').attr('data-which', ariaLabel || text)
  liElem.css('width', `${widthPercent}%`)
  liElem.append(linkElem)
  return liElem
}

/**
 * Create a bootstrap inline select element for setting the number of items per page
 * @param {string} id The ID of the central select element
 */
function makePerPageSelect (id, label) {
  const labelSpan = $('<span>').addClass('input-group-text my-1').text(label)
  labelSpan.attr('id', id + 'Label')

  const prepend = $('<div>').addClass('input-group-prepend')
  prepend.append(labelSpan)

  const selectElem = $('<select>').addClass('perPageSelect custom-select my-1').attr('id', id)
  selectElem.attr('aria-labeledby', id + 'Label')
  PER_PAGE_OPTIONS.forEach((i) => {
    selectElem[0].add($('<option>').val(i.toString()).text(i.toString())[0])
  })

  const inputGroup = $('<div>').addClass('input-group')
  inputGroup.append(prepend, selectElem)
  return inputGroup
}

function makeFilterByInput (options, label, id) {
  const labelSpan = $('<span>').addClass('input-group-text my-1').text(label)
  labelSpan.attr('id', id + 'Label')

  const dropdownButton = $('<button>').addClass('btn btn-outline-secondary dropdown-toggle filterByDropdown my-1')
  dropdownButton.attr('type', 'button').attr('data-toggle', 'dropdown')
  dropdownButton.attr('aria-haspopup', 'true').attr('aria-expanded', 'false')
  dropdownButton.text(options[0].text)

  const dropdownMenu = $('<div>').addClass('dropdown-menu')
  options.forEach((option) => {
    const linkItem = $('<a>').addClass('dropdown-item filterByLink').text(option.text)
    linkItem.attr('href', '#').attr('data-value', option.value)
    dropdownMenu.append(linkItem)
  })

  const prepend = $('<div>').addClass('input-group-prepend')
  prepend.append(labelSpan, dropdownButton, dropdownMenu)

  const filterInput = $('<input>').addClass('form-control filterTextInput my-1').attr('id', id)
  filterInput.attr('type', 'text').attr('placeholder', 'Filter Text')
  filterInput.attr('aria-labelledby', id + 'Label')

  const inputGroup = $('<div>').addClass('input-group')
  inputGroup.append(prepend, filterInput)
  return inputGroup
}

/**
 * Create a bootstrap inline select element with the label, id, and options specified
 * @param {string} id The ID of the central select element
 */
function makeSortBySelect (label, id, options, alignClass = '') {
  // Make label as input-group prepend
  const labelSpan = $('<span>').addClass('input-group-text my-1')
  labelSpan.attr('id', id + 'Label').text(label)

  const groupPrepend = $('<div>').addClass('input-group-prepend')
  groupPrepend.append(labelSpan)

  // Make the select element and add the options
  const selectElem = $('<select>').addClass('sortBySelect custom-select my-1').attr('id', id)
  selectElem.attr('aria-labeledby', id + 'Label')
  options.forEach((opt) => {
    selectElem[0].add($('<option>').val(opt.value).text(opt.text)[0])
  })

  // Make button with sort-order icon for appending to input group
  const button = $('<button>').addClass('btn btn-outline-secondary my-1 sortOrderButton').attr('type', 'button')
  button.append($('<i>').addClass('fas fa-sort-amount-up'))

  const groupAppend = $('<div>').addClass('input-group-append')
  groupAppend.append(button)

  // Make overall input group and add children
  const inputGroup = $('<div>').addClass('input-group')
  inputGroup.append(groupPrepend, selectElem, groupAppend)
  return inputGroup
}
