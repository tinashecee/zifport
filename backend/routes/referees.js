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
    const nil = (v) => (v === undefined ? null : v)

    // Map frontend form to DB columns (name -> first_name/last_name, licenseLevel -> license_level, etc.)
    if (refereeData.name != null && (refereeData.first_name == null || refereeData.last_name == null)) {
      const parts = String(refereeData.name).trim().split(/\s+/).filter(Boolean)
      refereeData.first_name = parts[0] || ''
      refereeData.last_name = parts.length > 1 ? parts.slice(1).join(' ') : refereeData.first_name
    }
    if (refereeData.licenseLevel != null && refereeData.license_level == null) refereeData.license_level = refereeData.licenseLevel
    if (refereeData.experience != null && refereeData.years_of_experience == null) refereeData.years_of_experience = refereeData.experience
    if (refereeData.contact && typeof refereeData.contact === 'object') {
      if (refereeData.contact.email != null && refereeData.email == null) refereeData.email = refereeData.contact.email
      if (refereeData.contact.phone != null && refereeData.phone == null) refereeData.phone = refereeData.contact.phone
    }
    if (typeof refereeData.certifications === 'string' && refereeData.certifications.trim()) {
      refereeData.certifications = refereeData.certifications.split(/\n/).map(s => s.trim()).filter(Boolean)
    }

    if (!refereeData.zifa_id) {
      const lastReferee = await query('SELECT zifa_id FROM referees ORDER BY id DESC LIMIT 1')
      let nextId = 1
      if (lastReferee.length > 0) {
        const lastId = parseInt(lastReferee[0].zifa_id.split('-')[2]) || 0
        nextId = lastId + 1
      }
      refereeData.zifa_id = `ZIFA-REF-${String(nextId).padStart(3, '0')}`
    }

    const params = [
      refereeData.zifa_id,
      (refereeData.first_name != null && String(refereeData.first_name).trim()) ? String(refereeData.first_name).trim() : 'Referee',
      (refereeData.last_name != null && String(refereeData.last_name).trim()) ? String(refereeData.last_name).trim() : 'Unknown',
      nil(refereeData.date_of_birth),
      refereeData.nationality || 'Zimbabwean',
      refereeData.license_level || 'Local',
      nil(refereeData.license_number),
      nil(refereeData.license_expiry_date),
      JSON.stringify(refereeData.certifications || []),
      refereeData.years_of_experience ?? 0,
      refereeData.matches_officiated ?? 0,
      refereeData.international_matches ?? 0,
      nil(refereeData.email),
      nil(refereeData.phone),
      nil(refereeData.address),
      refereeData.status || 'active',
      refereeData.availability || 'available',
      nil(refereeData.photo_url),
      JSON.stringify(refereeData.documents || {}),
      nil(refereeData.bio),
      nil(refereeData.notes),
      req.user?.id ?? nil(refereeData.created_by)
    ]

    const result = await query(
      `INSERT INTO referees (
        zifa_id, first_name, last_name, date_of_birth, nationality, license_level,
        license_number, license_expiry_date, certifications, years_of_experience,
        matches_officiated, international_matches, email, phone, address,
        status, availability, photo_url, documents, bio, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
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
    const nil = (v) => (v === undefined || v === '' ? null : v)
    const allowedKeys = new Set([
      'first_name', 'last_name', 'date_of_birth', 'nationality', 'license_level',
      'license_number', 'license_expiry_date', 'certifications', 'years_of_experience',
      'matches_officiated', 'international_matches', 'email', 'phone', 'address',
      'status', 'availability', 'photo_url', 'documents', 'bio', 'notes'
    ])

    const updates = []
    const values = []

    Object.keys(refereeData).forEach(key => {
      if (key === 'id' || key === 'created_at' || key === 'updated_at' || key === 'zifa_id' || key === 'created_by') return
      if (!allowedKeys.has(key)) return
      updates.push(`${key} = ?`)
      if ((key === 'documents' || key === 'certifications') && typeof refereeData[key] === 'object') {
        values.push(JSON.stringify(refereeData[key]))
      } else {
        values.push(nil(refereeData[key]))
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
