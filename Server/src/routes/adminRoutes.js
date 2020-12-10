// Using express for basic HTTP
import Express from 'express'

// for debugging messages instead of using console.log
import Debug from 'debug'

// for making the database with MongoDB
import { ClientEncryption } from 'mongodb-client-encryption'
import { MongoClient } from 'mongodb'

// Create a router to attach to an express server app
const router = new Express.Router()

const testObjects = [
  {
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  },
  {
    title: 'Les Misérables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    read: false
  },
  {
    title: 'The Time Machine',
    genre: 'Science Fiction',
    author: 'H. G. Wells',
    read: false
  },
  {
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    read: false
  },
  {
    title: 'The Dark World',
    genre: 'Fantasy',
    author: 'Henry Kuttner',
    read: false
  },
  {
    title: 'The Wind in the Willows',
    genre: 'Fantasy',
    author: 'Kenneth Grahame',
    read: false
  },
  {
    title: 'Life On The Mississippi',
    genre: 'History',
    author: 'Mark Twain',
    read: false
  },
  {
    title: 'Childhood',
    genre: 'Biography',
    author: 'Lev Nikolayevich Tolstoy',
    read: false
  }]

const debug = Debug('app:adminRoutes')

router.route('/')
  .get((req, res) => {
    const url = 'mongodb://localhost:27017'
    const dbName = 'eec-common';

    (async function mongo () {
      let client
      try {
        client = await MongoClient.connect(url)
        debug('Connected correctly to server')

        const db = client.db(dbName)

        // insert test objects to database for testing
        const response = await db.collection('test').insertMany(testObjects)
        res.json(response)
      } catch (err) {
        debug(err.stack)
      }
      client.close()
    }())
  })

// Expose the router for use in other files
export default router
