import axios from 'axios'
import store from 'store2'

const MAX_PER_PAGE = 250

export async function retrieveFullList (which) {
  // Validate 'which' type
  if (which !== 'user' && which !== 'team' && which !== 'unit') {
    throw new Error(`Invalid list type "${which}"`)
  }

  // Get first page of data and total count
  const response = await retrieveList(which, 1, MAX_PER_PAGE)
  let fullList = [...response.data]
  const total = response.count

  // Get remaining pages
  for (let page = 2; page < Math.ceil(total / MAX_PER_PAGE); page++) {
    const nextPage = await retrieveList(which, page, MAX_PER_PAGE)
    fullList = fullList.concat(nextPage.data)
  }

  return fullList
}

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

export function retrieveItem (which, id) {
  return new Promise((resolve, reject) => {
    // Validate 'which' type
    if (which !== 'user' && which !== 'team' && which !== 'unit') {
      return reject(new Error(`Invalid list type "${which}"`))
    }

    // Start the GET request
    axios.get(`../data/${which}/details/${id}`)
      .then((response) => {
        return resolve(response.data)
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function updateItem (which, newData) {
  return new Promise((resolve, reject) => {
    // Validate 'which' type
    if (which !== 'user' && which !== 'team' && which !== 'unit') {
      return reject(new Error(`Invalid list type "${which}"`))
    }

    // Start the POST request
    axios.post(`../data/${which}/update`, newData)
      .then((response) => {
        return resolve(response.data)
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function createItem (which, itemInfo) {
  return new Promise((resolve, reject) => {
    // Validate 'which' type
    if (which !== 'team' && which !== 'unit') {
      return reject(new Error(`Invalid type for item creation "${which}"`))
    }

    // Start the POST create request
    axios.post(`../data/${which}/register/`, itemInfo)
      .then((response) => {
        return resolve()
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function deleteItem (which, itemId) {
  return new Promise((resolve, reject) => {
    // Validate 'which' type
    if (which !== 'user' && which !== 'team' && which !== 'unit') {
      return reject(new Error(`Invalid list type "${which}"`))
    }

    // Start the DELETE request
    axios.delete(`../data/${which}/remove/${itemId}`)
      .then((response) => {
        return resolve()
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function promoteUser (userId) {
  return new Promise((resolve, reject) => {
    // Start the POST request
    axios.post('../data/user/promote', { id: userId, newType: 'admin' })
      .then((response) => {
        return resolve(response.data)
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function checkTeamMember (teamID) {
  return new Promise((resolve, reject) => {
    axios.get(`../data/user/memberOfTeam/${teamID}`)
      .then((response) => {
        return resolve(response.data.member)
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function userIsAdmin () {
  const token = store.local.get('JWT')

  // Validate that token has a payload
  if (typeof token !== 'string' || token.split('.').length < 2) {
    return false
  }

  // Decode the JWT payload only and check user type
  const userInfo = JSON.parse(atob(token.split('.')[1]))
  return (userInfo?.userType === 'admin')
}
