/* global axios */

export function retrieveList (which, page, perPage, sortBy, sortOrder, filterBy, filter) {
  return new Promise((resolve, reject) => {
    // Validate 'which' type
    if (which !== 'user' && which !== 'team' && which !== 'unit') {
      return reject(new Error(`Invalid list type "${which}"`))
    }

    // Build URL with query parameters
    let URL = `../data/${which}/list?fullInfo=true`
    URL += `&perPage=${perPage}&page=${page}`
    URL += (sortBy ? `&sortBy=${sortBy}` : '')
    URL += (sortOrder ? `&sortOrder=${sortOrder}` : '')
    URL += (filterBy ? `&filterBy=${filterBy}` : '')
    URL += (filter ? `&filter=${filter}` : '')

    // Start the GET request
    axios.get(URL)
      .then((response) => {
        // Deal with an empty data set
        if (response.data.total.length < 1) {
          return resolve({ count: 0, data: [] })
        }

        // Resolve the promise normally
        return resolve({
          count: response.data.total[0].filteredCount,
          data: response.data.data
        })
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}
