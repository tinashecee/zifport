// Referees Routes
import express from 'express'
import { query } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All referee routes require authentication
router.use(authenticate)

// Get all referees
router.get('/', async (req, res) => {
  try {
    const referees = await query(
      `SELECT * FROM referees 
       WHERE is_active = TRUE 
       ORDER BY created_at DESC`
    )
    res.json({ success: true, referees })
  } catch (error) {
    console.error('Get referees error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get referee by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const referees = await query(
      'SELECT * FROM referees WHERE id = ? AND is_active = TRUE',
      [id]
    )

    if (referees.length === 0) {
      return res.status(404).json({ error: 'Referee not found' })
    }

    res.json({ success: true, referee: referees[0] })
  } catch (error) {
    console.error('Get referee error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create referee
router.post('/', async (req, res) => {
  try {
    const refereeData = req.body

    if (!refereeData.zifa_id) {
      const lastReferee = await query('SELECT zifa_id FROM referees ORDER BY id DESC LIMIT 1')
      let nextId = 1
      if (lastReferee.length > 0) {
        const lastId = parseInt(lastReferee[0].zifa_id.split('-')[1]) || 0
        nextId = lastId + 1
      }
      refereeData.zifa_id = `ZIFA-REF-${String(nextId).padStart(3, '0')}`
    }

    const result = await query(
      `INSERT INTO referees (
        zifa_id, first_name, last_name, date_of_birth, nationality, license_level,
        license_number, license_expiry_date, certifications, years_of_experience,
        matches_officiated, international_matches, email, phone, address,
        status, availability, photo_url, documents, bio, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        refereeData.zifa_id, refereeData.first_name, refereeData.last_name,
        refereeData.date_of_birth, refereeData.nationality || 'Zimbabwean',
        refereeData.license_level, refereeData.license_number, refereeData.license_expiry_date,
        JSON.stringify(refereeData.certifications || []), refereeData.years_of_experience || 0,
        refereeData.matches_officiated || 0, refereeData.international_matches || 0,
        refereeData.email, refereeData.phone, refereeData.address,
        refereeData.status || 'active', refereeData.availability || 'available',
        refereeData.photo_url, JSON.stringify(refereeData.documents || {}),
        refereeData.bio, refereeData.notes, refereeData.created_by
      ]
    )

    const referees = await query('SELECT * FROM referees WHERE id = ?', [result.insertId])
    res.status(201).json({ success: true, referee: referees[0] })
  } catch (error) {
    console.error('Create referee error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update referee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const refereeData = req.body

    const updates = []
    const values = []

    Object.keys(refereeData).forEach(key => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        updates.push(`${key} = ?`)
        if ((key === 'documents' || key === 'certifications') && typeof refereeData[key] === 'object') {
          values.push(JSON.stringify(refereeData[key]))
        } else {
          values.push(refereeData[key])
        }
      }
    })

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(id)
    await query(`UPDATE referees SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values)

    const referees = await query('SELECT * FROM referees WHERE id = ?', [id])
    res.json({ success: true, referee: referees[0] })
  } catch (error) {
    console.error('Update referee error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete referee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await query('UPDATE referees SET is_active = FALSE, updated_at = NOW() WHERE id = ?', [id])
    res.json({ success: true, message: 'Referee deleted successfully' })
  } catch (error) {
    console.error('Delete referee error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
