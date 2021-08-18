// Bring in mongodb and rate limiter libraries
import MongoDB from 'mongodb'
import { RateLimiterMongo } from 'rate-limiter-flexible'

// Create options object for a mongoDB backed rate-limiter
const storeOpts = {
  storeClient: MongoDB.MongoClient.connect(
    'mongodb://localhost:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
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
