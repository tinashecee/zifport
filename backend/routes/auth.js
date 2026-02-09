// Authentication Routes
import express from 'express'
import { query } from '../config/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'zifa_secret_key_change_in_production'

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Get user from database
    const users = await query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? AND u.is_active = TRUE',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]

    // In production, passwords should be hashed. For now, simple comparison
    // TODO: Implement proper password hashing
    if (user.password !== password) {
      // Check if password is hashed (starts with $2y$ or $2a$)
      if (user.password.startsWith('$2')) {
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid email or password' })
        }
      } else {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
    }

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id])

    // Remove password from response
    delete user.password

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      user,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Validate required fields with specific error messages
    const missingFields = []
    if (!name || name.trim() === '') missingFields.push('name')
    if (!email || email.trim() === '') missingFields.push('email')
    if (!password || password.trim() === '') missingFields.push('password')
    if (!role || role.trim() === '') missingFields.push('role')

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      })
    }

    // Check if user already exists
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Get role ID
    const roles = await query('SELECT id FROM roles WHERE name = ?', [role])
    if (roles.length === 0) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const roleId = roles[0].id

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const result = await query(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, roleId]
    )

    // Get created user
    const users = await query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [result.insertId]
    )

    const user = users[0]
    delete user.password

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      success: true,
      user,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const users = await query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.is_active = TRUE',
      [decoded.id]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const user = users[0]
    delete user.password

    res.json({ success: true, user })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
