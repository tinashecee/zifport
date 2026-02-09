// Clubs Routes
import express from 'express'
import { query } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All club routes require authentication
router.use(authenticate)

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await query(
      'SELECT * FROM clubs WHERE is_active = TRUE ORDER BY name ASC'
    )
    res.json({ success: true, clubs })
  } catch (error) {
    console.error('Get clubs error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get club by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const clubs = await query(
      'SELECT * FROM clubs WHERE id = ? AND is_active = TRUE',
      [id]
    )

    if (clubs.length === 0) {
      return res.status(404).json({ error: 'Club not found' })
    }

    res.json({ success: true, club: clubs[0] })
  } catch (error) {
    console.error('Get club error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
