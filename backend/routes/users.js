// Users Routes
import express from 'express'
import { query } from '../config/database.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// All user routes require authentication and admin role
router.use(authenticate)
router.use(authorize('admin'))

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.is_active, u.last_login, u.created_at,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    )
    res.json({ success: true, users })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
