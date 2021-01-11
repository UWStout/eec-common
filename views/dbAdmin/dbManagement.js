/* global axios */

export function retrieveUsers (page, perPage) {
  return new Promise((resolve, reject) => {
    axios.get(`../data/user/list?fullInfo=true&perPage=${perPage}&page=${page}`)
      .then((response) => {
        console.log(response)
        return resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}

export function retrieveTeams (page, perPage) {
  // TODO: This endpoint doesn't exist yet, will always fail
  return new Promise((resolve, reject) => {
    axios.get(`data/team/list?fullInfo=true&perPage=${perPage}&page=${page}`)
      .then((response) => {
        console.log(response)
        return resolve(response.data)
      })
      .catch((error) => {
        console.log(error)
        return reject(error)
      })
  })
}
