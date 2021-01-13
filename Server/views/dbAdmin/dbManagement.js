/* global axios */

export function retrieveList (which, page, perPage, sortBy, sortOrder, filterBy, filter) {
  return new Promise((resolve, reject) => {
    // Validate 'which' type
    if (which !== 'user' && which !== 'team') {
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
