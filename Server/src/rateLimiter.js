// Bring in mongodb and rate limiter libraries
import MongoDB from 'mongodb'
import { RateLimiterMongo } from 'rate-limiter-flexible'

// Read extra environment variables from the .env file
import dotenv from 'dotenv'

// Load .env config
dotenv.config()

// URL of the database server
const DB_SERVER_URL = 'mongodb://localhost:27017'
const PROD_SERVER_URL = `mongodb+srv://${process.env.MONGO_USER}@karunacluster1.yb2nw.mongodb.net/karunaLimiter?retryWrites=true&w=majority`

// Create options object for a mongoDB backed rate-limiter
const storeOpts = {
  storeClient: MongoDB.MongoClient.connect(
    (process.env.HEROKU ? PROD_SERVER_URL : DB_SERVER_URL),
    { useNewUrlParser: true, useUnifiedTopology: true }
  ),
  dbName: 'karunaLimiter'
}

// Create express.js middleware that uses that limiter
const makeRateLimiter = (prefix = 'default', points = 10, duration = 10) => {
  // Create mongodb backed rate limiter
  const rateLimiterMongo = new RateLimiterMongo({
    ...storeOpts,
    keyPrefix: prefix,
    points: points,
    duration: duration
  })

  // Return middleware function that uses the limiter
  return (req, res, next) => {
    // Combine ip-address and email to make key
    rateLimiterMongo.consume(`${req.ip}-${req.body.email}`)
      .then(() => { next() })
      .catch(() => {
        res.status(429).send('Too Many Requests')
      })
  }
}

// Export for external use
export default makeRateLimiter
