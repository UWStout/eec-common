import MongoDB from 'mongodb'
const { MongoClient } = MongoDB

// URL of the database server
const DB_SERVER_URL = 'mongodb://localhost:27017'

export function connectDB () {
  // Attempt to connect
  console.log(`Connecting to '${DB_SERVER_URL}'`)
  return MongoClient.connect(DB_SERVER_URL, { useUnifiedTopology: true })
}

export function closeDB (DB) {
  return DB.close()
}

export function clearCollection (DB, collectionName) {
  console.log(`> Deleting all documents from '${collectionName}' collection`)

  return new Promise((resolve, reject) => {
    // Clear the collection
    DB.collection(collectionName).deleteMany({}, (err, result) => {
      if (err) { return reject(err) }
      const plural = (result.deletedCount === 1 ? 'document' : 'documents')
      console.log(`  - ${result.deletedCount} ${plural} deleted`)
      return resolve()
    })
  })
}

export function insertAllInCollection (DB, collectionName, data) {
  const plural = (data.length === 1 ? 'document' : 'documents')
  console.log(`> Inserting ${data.length} ${plural} into '${collectionName}' collection`)

  return new Promise((resolve, reject) => {
    DB.collection(collectionName).insertMany(data, (err, result) => {
      if (err) { return reject(err) }
      const plural = (result.insertedCount === 1 ? 'document' : 'documents')
      console.log(`  - ${result.insertedCount} ${plural} inserted`)
      return resolve(result.insertedIds)
    })
  })
}

export function updateAllInCollection (DB, collectionName, ids, newData) {
  const plural = (newData.length === 1 ? 'document' : 'documents')
  console.log(`> Updating ${newData.length} ${plural} into '${collectionName}' collection`)

  return Promise.all(
    newData.map((curDoc, i) => {
      return new Promise((resolve, reject) => {
        DB.collection(collectionName).findOneAndUpdate(
          { _id: ids[i] },
          { $set: curDoc },
          (err, result) => {
            if (err) { return reject(err) }
            return resolve(result.value !== null)
          }
        )
      })
    })
  )
}
