// Coaches Routes
import express from 'express'
import { query } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All coach routes require authentication
router.use(authenticate)

// Get all coaches
router.get('/', async (req, res) => {
  try {
    const coaches = await query(
      `SELECT c.*, cl.name as club_name 
       FROM coaches c 
       LEFT JOIN clubs cl ON c.club_id = cl.id 
       WHERE c.is_active = TRUE 
       ORDER BY c.created_at DESC`
    )
    res.json({ success: true, coaches })
  } catch (error) {
    console.error('Get coaches error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get coach by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const coaches = await query(
      `SELECT c.*, cl.name as club_name 
       FROM coaches c 
       LEFT JOIN clubs cl ON c.club_id = cl.id 
       WHERE c.id = ? AND c.is_active = TRUE`,
      [id]
    )

    if (coaches.length === 0) {
      return res.status(404).json({ error: 'Coach not found' })
    }

    res.json({ success: true, coach: coaches[0] })
  } catch (error) {
    console.error('Get coach error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create coach
router.post('/', async (req, res) => {
  try {
    const coachData = req.body
    const nil = (v) => (v === undefined ? null : v)

    // Map frontend form shape to DB columns (name -> first_name/last_name, licenseLevel -> license_level, etc.)
    if (coachData.name != null && (coachData.first_name == null || coachData.last_name == null)) {
      const parts = String(coachData.name).trim().split(/\s+/).filter(Boolean)
      coachData.first_name = parts[0] || ''
      coachData.last_name = parts.length > 1 ? parts.slice(1).join(' ') : coachData.first_name
    }
    if (coachData.licenseLevel != null && coachData.license_level == null) coachData.license_level = coachData.licenseLevel
    if (coachData.experience != null && coachData.years_of_experience == null) coachData.years_of_experience = coachData.experience
    if (coachData.contact && typeof coachData.contact === 'object') {
      if (coachData.contact.email != null && coachData.email == null) coachData.email = coachData.contact.email
      if (coachData.contact.phone != null && coachData.phone == null) coachData.phone = coachData.contact.phone
    }
    if (typeof coachData.certifications === 'string' && coachData.certifications.trim()) {
      coachData.certifications = coachData.certifications.split(/\n/).map(s => s.trim()).filter(Boolean)
    }

    if (!coachData.zifa_id) {
      const lastCoach = await query('SELECT zifa_id FROM coaches ORDER BY id DESC LIMIT 1')
      let nextId = 1
      if (lastCoach.length > 0) {
        const lastId = parseInt(lastCoach[0].zifa_id.split('-')[2]) || 0
        nextId = lastId + 1
      }
      coachData.zifa_id = `ZIFA-COACH-${String(nextId).padStart(3, '0')}`
    }

    const params = [
      coachData.zifa_id,
      (coachData.first_name != null && String(coachData.first_name).trim()) ? String(coachData.first_name).trim() : 'Coach',
      (coachData.last_name != null && String(coachData.last_name).trim()) ? String(coachData.last_name).trim() : 'Unknown',
      nil(coachData.date_of_birth),
      coachData.nationality || 'Zimbabwean',
      coachData.license_level || 'Local',
      nil(coachData.license_number),
      nil(coachData.license_expiry_date),
      JSON.stringify(coachData.certifications || []),
      coachData.years_of_experience ?? 0,
      nil(coachData.previous_clubs),
      nil(coachData.achievements),
      nil(coachData.club_id),
      nil(coachData.team_type),
      nil(coachData.contract_start_date),
      nil(coachData.contract_end_date),
      nil(coachData.email),
      nil(coachData.phone),
      nil(coachData.address),
      coachData.status || 'active',
      coachData.availability || 'available',
      nil(coachData.photo_url),
      JSON.stringify(coachData.documents || {}),
      nil(coachData.bio),
      nil(coachData.notes),
      req.user?.id ?? nil(coachData.created_by)
    ]

    const result = await query(
      `INSERT INTO coaches (
        zifa_id, first_name, last_name, date_of_birth, nationality, license_level,
        license_number, license_expiry_date, certifications, years_of_experience,
        previous_clubs, achievements, club_id, team_type, contract_start_date,
        contract_end_date, email, phone, address, status, availability,
        photo_url, documents, bio, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    )

    const coaches = await query('SELECT * FROM coaches WHERE id = ?', [result.insertId])
    res.status(201).json({ success: true, coach: coaches[0] })
  } catch (error) {
    console.error('Create coach error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update coach
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const coachData = req.body
    const nil = (v) => (v === undefined || v === '' ? null : v)
    const allowedKeys = new Set([
      'first_name', 'last_name', 'date_of_birth', 'nationality', 'license_level',
      'license_number', 'license_expiry_date', 'certifications', 'years_of_experience',
      'previous_clubs', 'achievements', 'club_id', 'team_type', 'contract_start_date',
      'contract_end_date', 'email', 'phone', 'address', 'status', 'availability',
      'photo_url', 'documents', 'bio', 'notes'
    ])

    const updates = []
    const values = []

    Object.keys(coachData).forEach(key => {
      if (key === 'id' || key === 'created_at' || key === 'updated_at' || key === 'zifa_id' || key === 'created_by') return
      if (!allowedKeys.has(key)) return
      updates.push(`${key} = ?`)
      if ((key === 'documents' || key === 'certifications') && typeof coachData[key] === 'object') {
        values.push(JSON.stringify(coachData[key]))
      } else {
        values.push(nil(coachData[key]))
      }
    })

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(id)
    await query(`UPDATE coaches SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values)

    const coaches = await query('SELECT * FROM coaches WHERE id = ?', [id])
    res.json({ success: true, coach: coaches[0] })
  } catch (error) {
    console.error('Update coach error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete coach
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await query('UPDATE coaches SET is_active = FALSE, updated_at = NOW() WHERE id = ?', [id])
    res.json({ success: true, message: 'Coach deleted successfully' })
  } catch (error) {
    console.error('Delete coach error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
