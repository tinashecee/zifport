// Players Routes
import express from 'express'
import { query } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// All player routes require authentication
router.use(authenticate)

// Get all players
router.get('/', async (req, res) => {
  try {
    const { search, club, position, status, availability, limit = 100, offset = 0 } = req.query

    let sql = `
      SELECT p.*, 
             c.name as club_name,
             TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) - 
             (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(p.date_of_birth, '%m%d')) AS age
      FROM players p
      LEFT JOIN clubs c ON p.club_id = c.id
      WHERE p.is_active = TRUE
    `
    const params = []

    if (search) {
      sql += ` AND (p.first_name LIKE ? OR p.last_name LIKE ? OR p.zifa_id LIKE ?)`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    if (club) {
      sql += ` AND p.club_id = ?`
      params.push(club)
    }

    if (position) {
      sql += ` AND p.position = ?`
      params.push(position)
    }

    if (status) {
      sql += ` AND p.status = ?`
      params.push(status)
    }

    if (availability) {
      sql += ` AND p.availability = ?`
      params.push(availability)
    }

    sql += ` ORDER BY p.created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`

    const players = await query(sql, params)

    res.json(players)
  } catch (error) {
    console.error('Get players error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
  }
})

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const players = await query(
      `SELECT p.*, 
              c.name as club_name, c.city as club_city,
              TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) - 
              (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(p.date_of_birth, '%m%d')) AS age
       FROM players p
       LEFT JOIN clubs c ON p.club_id = c.id
       WHERE p.id = ? AND p.is_active = TRUE`,
      [id]
    )

    if (players.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json({ success: true, player: players[0] })
  } catch (error) {
    console.error('Get player error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create player
router.post('/', async (req, res) => {
  try {
    const playerData = req.body

    // Generate ZIFA ID if not provided
    if (!playerData.zifa_id) {
      const lastPlayer = await query('SELECT zifa_id FROM players ORDER BY id DESC LIMIT 1')
      let nextId = 1
      if (lastPlayer.length > 0) {
        const lastId = parseInt(lastPlayer[0].zifa_id.split('-')[1]) || 0
        nextId = lastId + 1
      }
      playerData.zifa_id = `ZIFA-${String(nextId).padStart(5, '0')}`
    }

    // Resolve club: use club_id if provided, else find or create by club name
    if (playerData.club_id == null && (playerData.club_name || playerData.club)) {
      const clubName = (playerData.club_name || playerData.club || '').trim()
      if (clubName) {
        let clubs = await query('SELECT id FROM clubs WHERE name = ? AND is_active = TRUE', [clubName])
        if (clubs.length === 0) {
          await query('INSERT INTO clubs (name, country) VALUES (?, ?)', [clubName, 'Zimbabwe'])
          clubs = await query('SELECT id FROM clubs WHERE name = ?', [clubName])
        }
        if (clubs.length > 0) playerData.club_id = clubs[0].id
      }
    }

    // Use null for undefined so MySQL bind accepts optional fields
    const nil = (v) => (v === undefined ? null : v)

    const params = [
      playerData.zifa_id, playerData.first_name, playerData.last_name,
      playerData.date_of_birth, playerData.nationality || 'Zimbabwean',
      nil(playerData.dual_nationality), playerData.position, nil(playerData.preferred_foot),
      nil(playerData.height_cm), nil(playerData.weight_kg), nil(playerData.club_id),
      nil(playerData.contract_start_date), nil(playerData.contract_end_date),
      nil(playerData.jersey_number), playerData.international_appearances ?? 0,
      playerData.international_goals ?? 0, playerData.season_goals ?? 0,
      playerData.all_time_goals ?? 0, playerData.season_assists ?? 0,
      playerData.all_time_assists ?? 0, playerData.games_played ?? 0,
      playerData.yellow_cards ?? 0, playerData.red_cards ?? 0,
      nil(playerData.email), nil(playerData.phone), nil(playerData.address),
      nil(playerData.emergency_contact_name), nil(playerData.emergency_contact_phone),
      playerData.status || 'pending', playerData.availability || 'available',
      nil(playerData.injury_status), nil(playerData.suspension_end_date),
      nil(playerData.passport_number), nil(playerData.passport_expiry_date),
      nil(playerData.photo_url), JSON.stringify(playerData.documents || {}),
      nil(playerData.bio), nil(playerData.achievements), nil(playerData.notes),
      req.user?.id ?? nil(playerData.created_by)
    ]

    const result = await query(
      `INSERT INTO players (
        zifa_id, first_name, last_name, date_of_birth, nationality, dual_nationality,
        position, preferred_foot, height_cm, weight_kg, club_id, contract_start_date,
        contract_end_date, jersey_number, international_appearances, international_goals,
        season_goals, all_time_goals, season_assists, all_time_assists, games_played,
        yellow_cards, red_cards, email, phone, address, emergency_contact_name,
        emergency_contact_phone, status, availability, injury_status, suspension_end_date,
        passport_number, passport_expiry_date, photo_url, documents, bio, achievements,
        notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    )

    const players = await query('SELECT * FROM players WHERE id = ?', [result.insertId])
    res.status(201).json({ success: true, player: players[0] })
  } catch (error) {
    console.error('Create player error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
  }
})

// Update player
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const playerData = req.body
    const nil = (v) => (v === undefined || v === '' ? null : v)

    // Build dynamic update query; use null for undefined so MySQL bind accepts
    const updates = []
    const values = []
    const allowedKeys = new Set([
      'first_name', 'last_name', 'date_of_birth', 'nationality', 'dual_nationality',
      'position', 'preferred_foot', 'height_cm', 'weight_kg', 'club_id',
      'contract_start_date', 'contract_end_date', 'jersey_number',
      'international_appearances', 'international_goals', 'season_goals', 'all_time_goals',
      'season_assists', 'all_time_assists', 'games_played', 'yellow_cards', 'red_cards',
      'email', 'phone', 'address', 'emergency_contact_name', 'emergency_contact_phone',
      'status', 'availability', 'injury_status', 'suspension_end_date',
      'passport_number', 'passport_expiry_date', 'photo_url', 'documents',
      'bio', 'achievements', 'notes'
    ])

    Object.keys(playerData).forEach(key => {
      if (key === 'id' || key === 'created_at' || key === 'updated_at' || key === 'zifa_id' || key === 'created_by') return
      if (!allowedKeys.has(key)) return
      updates.push(`${key} = ?`)
      if (key === 'documents' && typeof playerData[key] === 'object') {
        values.push(JSON.stringify(playerData[key]))
      } else {
        values.push(nil(playerData[key]))
      }
    })

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(id)
    await query(`UPDATE players SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`, values)

    const players = await query('SELECT * FROM players WHERE id = ?', [id])
    res.json({ success: true, player: players[0] })
  } catch (error) {
    console.error('Update player error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete player (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await query('UPDATE players SET is_active = FALSE, updated_at = NOW() WHERE id = ?', [id])

    res.json({ success: true, message: 'Player deleted successfully' })
  } catch (error) {
    console.error('Delete player error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
