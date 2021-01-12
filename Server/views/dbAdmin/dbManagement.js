/* global axios */

export function retrieveUserCount () {
  return new Promise((resolve, reject) => {
    axios.get('../data/user/count')
      .then((response) => { return resolve(response.data) })
      .catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

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
      .then((response) => { return resolve(response.data) })
      .catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}
