/* global $ */

/**
 * Create the full nav bar element for display above/below the list of pageable data
 * @param {number} pages Number of page buttons to include
 * @param {Array(Object)} sortByOptions Array of objects with 'text' and 'value' props for sort-by select
 * @param {string} idPrefix Prefix to apply to the input IDs (defaults to empty string)
 * @return {JQueryElement} Full nav bar element created with JQuery
 */
export function makeFullNavBar (pages, sortByOptions, idPrefix = '') {
  // The three main columns of the full nav bar and return
  const col1 = $('<div>').addClass('col-4').append(makePageNav(pages))
  const col2 = $('<div>').addClass('col-4').append(makePerPageSelect(idPrefix + 'PerPageInput', 'mx-auto'))
  const col3 = $('<div>').addClass('col-4').append(makeGenericSelect('Sort By:', idPrefix + 'SortByInput', sortByOptions, 'ml-auto'))
  return [col1, col2, col3]
}

/**
 * Create a Bootstrap pageination element with prev and next buttons
 * @param {number} pages How many page buttons to include (minimum 1)
 */
function makePageNav (pages) {
  const paginationUL = $('<ul>').addClass('pagination my-1')
  paginationUL.append(makePageButton('&laquo;', 'Previous'))
  for (let page = 1; page <= pages; page++) {
    paginationUL.append(makePageButton(page))
  }
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
  const linkElem = $('<a>').addClass('page-link').attr('href', '#')
  if (ariaLabel) {
    linkElem.attr('aria-label', ariaLabel)
    const hiddenSpan = $('<span>').attr('aria-hidden', 'true').html(text)
    linkElem.append(hiddenSpan)
  } else {
    linkElem.html(text)
  }

  // Make and return li tag
  const liElem = $('<li>').addClass('page-item').append(linkElem)
  return liElem
}

/**
 * Create a bootstrap inline select element for setting the number of items per page
 * @param {string} id The ID of the central select element
 */
function makePerPageSelect (id, alignClass = 'mx-auto') {
  // Make the select element and add options
  const [formGroup, select] = makeSelectGroup('Per Page:', id)
  for (let i = 5; i <= 25; i += 5) {
    select[0].add($('<option>').val(i.toString()).text(i.toString())[0])
  }

  // Apply alignment class
  formGroup.addClass(alignClass)

  // Make the surrounding form element, append, and return
  const formElem = $('<form>').addClass('form-inline')
  formElem.append(formGroup)
  return formElem
}

/**
 * Create a bootstrap inline select element with the label, id, and options specified
 * @param {string} id The ID of the central select element
 */
function makeGenericSelect (label, id, options, alignClass = 'ml-auto') {
  // Make the select element and add options
  const [formGroup, select] = makeSelectGroup(label, id)
  options.forEach((opt) => {
    select[0].add($('<option>').val(opt.value).text(opt.text)[0])
  })

  // Apply alignment class
  formGroup.addClass(alignClass)

  // Make the surrounding form element, append, and return
  const formElem = $('<form>').addClass('form-inline')
  formElem.append(formGroup)
  return formElem
}

/**
 * Create a bootstrap labeled form group with a select element.
 * @param {string} label Text for the group label
 * @param {string} id ID for the select element
 * @returns {Array(JQueryElement)} Returns the other form div in [0] and the select element in [1]
 */
function makeSelectGroup (label, id) {
  // Create label and select element
  const labelElem = $('<label>').addClass('my-1 mr-2').attr('for', id).text(label)
  const selectElem = $('<select>').addClass('custom-select my-1 mr-2').attr('id', id)

  // Create surrounding form group and append
  const formGroupDiv = $('<div>').addClass('form-group')
  formGroupDiv.append(labelElem, selectElem)

  // Return both the outer group and the input
  return [formGroupDiv, selectElem]
}
