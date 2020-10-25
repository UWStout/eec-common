// Express router
import Express from 'express'

// JWT authorization middleware
import { authenticateToken } from './auth.js'

// Create a router to attach to an express server app
const router = new Express.Router()

