// Defaults used for lists
const DEFAULT_PER_PAGE = 25
const MAX_PER_PAGE = 100
const DEFAULT_PAGE = 1

export function getPaginationValues (query, defaultPer = DEFAULT_PER_PAGE, maxPer = MAX_PER_PAGE, defaultPage = DEFAULT_PAGE) {
  // Validate query parameters
  if (query.perPage && isNaN(parseInt(query.perPage))) { return [NaN, NaN] }
  if (query.page && isNaN(parseInt(query.page))) { return [NaN, NaN] }

  // Sanitize query inputs
  let perPage = (isNaN(parseInt(query.perPage)) ? undefined : parseInt(query.perPage))
  if (!perPage) { perPage = defaultPer }
  perPage = Math.min(perPage, maxPer)

  let page = (isNaN(parseInt(query.page)) ? undefined : parseInt(query.page))
  if (!page) { page = defaultPage }

  // Continue processing
  return [perPage, page]
}

// Standard error checking for our express routes
export function checkAndReportError (message, res, err, debug) {
  if (err) {
    debug(message)
    debug(err)
    if (res) { res.status(500).send({ error: true, message }) }
    return true
  }

  return false
}
