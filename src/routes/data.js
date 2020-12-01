// Express router
import Express from 'express'

// for using the database
import { ClientEncryption } from 'mongodb-client-encryption'
import { MongoClient, ObjectID } from 'mongodb'

// JWT authorization middleware
import { authenticateToken } from './auth.js'
import Debug from 'debug'
const debug = Debug('server:data')

// Create a router to attach to an express server app
const router = new Express.Router()

// list_items (authorized only)
router.get('/list_items', authenticateToken, (req, res) => {
  res.json([{ item: 1 }, { item: 2 }])
})

// list_items (authorized ADMIN only)
router.get('/list_secret_items', authenticateToken, (req, res) => {
  // Check if they are an admin
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({
      error: true, message: 'not authorized (admins only)'
    })
  }
  res.json([{ item: 3 }, { item: 4 }])
})

router.route('/')
  .get((req, res) => {
    // const url = 'mongodb://localhost:27017'
    // const dbName = 'eec-common';

    const uri = 'mongodb+srv://testUser:7AkaGi94EKFaImP1@cluster0.uiraz.mongodb.net/test?retryWrites=true&w=majority';

    (async function mongo () {
      let client
      try {
        client = new MongoClient(uri, { useNewUrlParser: true })
        await client.connect()
        debug('Connected correctly to server')
        const database = client.db('sample_mflix')
        const collection = await database.collection('movies')

        // Query for a movie that has the title 'Back to the Future'
        // const query = { title: 'Back to the Future' }
        // const movie = await collection.findOne(query)

        await listDatabases(client)

        // const db = client.db(dbName)
        // const col = await db.collection('test')
        const books = await collection.find().toArray()

        res.render(
          'databaseView',
          {
            books,
            title: 'Test database'
          }
        )
      } catch (err) {
        debug(err.stack)
      } finally {
        client.close()
      }
    }())
  })

async function listDatabases (client) {
  const databasesList = await client.db().admin().listDatabases()

  console.log('Databases:')
  databasesList.databases.forEach(db => debug(` - ${db.name}`))
};

router.route('/:id')
  .get((req, res) => {
    const { id } = req.params
    const uri = 'mongodb+srv://testUser:7AkaGi94EKFaImP1@cluster0.uiraz.mongodb.net/test?retryWrites=true&w=majority';

    (async function mongo () {
      let client
      try {
        client = new MongoClient(uri, { useNewUrlParser: true })
        await client.connect()
        debug('Connected correctly to server')
        const database = client.db('sample_mflix')
        const collection = await database.collection('movies')

        const book = await collection.findOne({ _id: new ObjectID(id) })
        debug(book)
        res.render(
          'dataView',
          {
            title: 'Test Database',
            book
          }
        )
      } catch (err) {
        debug(err.stack)
      }
    }())
  })

// Expose the router for use in other files
export default router
