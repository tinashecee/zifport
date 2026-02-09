// Authentication Middleware
import jwt from 'jsonwebtoken'
import { query } from '../config/database.js'

const JWT_SECRET = process.env.JWT_SECRET || 'zifa_secret_key_change_in_production'

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Authentication required.' })
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Get user from database
    const users = await query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.is_active = TRUE',
      [decoded.id]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token. User not found.' })
    }

    // Attach user to request
    req.user = users[0]
    delete req.user.password

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' })
    }
    console.error('Auth middleware error:', error)
    return res.status(500).json({ error: 'Authentication error' })
  }
}

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role_name)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}
