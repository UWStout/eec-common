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
  return new Promise((resolve, reject) => {
    // Clear the collection
    console.log(`> Deleting all documents from '${collectionName}' collection`)
    DB.collection(collectionName).deleteMany({}, (err, result) => {
      if (err) { return reject(err) }
      const plural = (result.deletedCount === 1 ? 'document' : 'documents')
      console.log(`  - ${result.deletedCount} ${plural} deleted`)
      return resolve()
    })
  })
}

export function insertAllInCollection (DB, collectionName, data) {
  return new Promise((resolve, reject) => {
    const plural = (data.length === 1 ? 'document' : 'documents')
    console.log(`> Inserting ${data.length} ${plural} into '${collectionName}' collection`)
    DB.collection(collectionName).insertMany(data, (err, result) => {
      if (err) { return reject(err) }
      const plural = (result.insertedCount === 1 ? 'document' : 'documents')
      console.log(`  - ${result.insertedCount} ${plural} inserted`)
      return resolve(result.insertedIds)
    })
  })
}
