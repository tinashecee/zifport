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

// Create club
router.post('/', async (req, res) => {
  try {
    const body = req.body
    const name = body.name?.trim()
    if (!name) {
      return res.status(400).json({ error: 'Club name is required' })
    }
    const country = body.country?.trim() || 'Zimbabwe'
    const existing = await query('SELECT * FROM clubs WHERE name = ? AND is_active = TRUE', [name])
    if (existing.length > 0) {
      return res.status(200).json({ success: true, club: existing[0], created: false })
    }
    const nil = (v) => (v === undefined || v === '' ? null : v)
    const abbreviation = nil(body.abbreviation?.trim())
    const city = nil(body.city?.trim())
    const foundedYear = body.founded_year ? parseInt(body.founded_year, 10) : null
    const logoUrl = nil(body.logo_url?.trim())
    const website = nil(body.website?.trim())
    const contactEmail = nil(body.contact_email?.trim())
    const contactPhone = nil(body.contact_phone?.trim())
    const address = nil(body.address?.trim())

    const result = await query(
      `INSERT INTO clubs (name, abbreviation, city, country, founded_year, logo_url, website, contact_email, contact_phone, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, abbreviation, city, country, foundedYear, logoUrl, website, contactEmail, contactPhone, address]
    )
    const clubs = await query('SELECT * FROM clubs WHERE id = ?', [result.insertId])
    res.status(201).json({ success: true, club: clubs[0], created: true })
  } catch (error) {
    console.error('Create club error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
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
