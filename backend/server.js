// ZIFA Portal Backend API Server
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database.js'
import authRoutes from './routes/auth.js'
import playerRoutes from './routes/players.js'
import coachRoutes from './routes/coaches.js'
import refereeRoutes from './routes/referees.js'
import clubRoutes from './routes/clubs.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Test database connection on startup
testConnection()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/players', playerRoutes)
app.use('/api/coaches', coachRoutes)
app.use('/api/referees', refereeRoutes)
app.use('/api/clubs', clubRoutes)
app.use('/api/users', userRoutes)

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection()
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ZIFA Portal API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      players: '/api/players',
      coaches: '/api/coaches',
      referees: '/api/referees',
      clubs: '/api/clubs',
      users: '/api/users'
    }
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
})

// Start server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 ZIFA Portal API server running on port ${PORT}`)
  console.log(`📡 Database: 161.97.183.92/zifa_portal`)
  console.log(`🌐 API URL: http://localhost:${PORT}`)
})
