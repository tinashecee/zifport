import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { playersAPI } from '@/services/api'

export const usePlayersStore = defineStore('players', () => {
  const players = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load players from API
  const loadPlayers = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await playersAPI.getAll()
      // Handle both array and object responses
      if (Array.isArray(data)) {
        players.value = data
      } else if (data && Array.isArray(data.players)) {
        players.value = data.players
      } else if (data && data.success && Array.isArray(data.players)) {
        players.value = data.players
      } else {
        players.value = []
      }
    } catch (err) {
      error.value = err.message || 'Failed to load players'
      console.error('Error loading players:', err)
      players.value = []
    } finally {
      loading.value = false
    }
  }

  // Add new player
  const addPlayer = async (playerData) => {
    loading.value = true
    error.value = null
    try {
      const newPlayer = await playersAPI.create(playerData)
      await loadPlayers() // Reload to get updated list
      return newPlayer
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update player
  const updatePlayer = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updatedPlayer = await playersAPI.update(id, updates)
      await loadPlayers() // Reload to get updated list
      return updatedPlayer
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete player
  const deletePlayer = async (id) => {
    loading.value = true
    error.value = null
    try {
      await playersAPI.delete(id)
      await loadPlayers() // Reload to get updated list
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get player by ID
  const getPlayerById = (id) => {
    return players.value.find(p => p.id === id)
  }

  // Search and filter players
  const searchPlayers = (filters = {}) => {
    let results = [...players.value]

    if (filters.name) {
      const nameLower = filters.name.toLowerCase()
      results = results.filter(p => {
        const firstName = (p.first_name || '').toLowerCase()
        const lastName = (p.last_name || '').toLowerCase()
        const fullName = `${firstName} ${lastName}`.trim()
        return fullName.includes(nameLower) || firstName.includes(nameLower) || lastName.includes(nameLower)
      })
    }

    if (filters.club) {
      // If club is a string (club name), filter by club name
      // If club is a number (club_id), filter by club_id
      if (typeof filters.club === 'string') {
        results = results.filter(p => {
          // Check if player has club_name property or club object
          return p.club_name === filters.club || p.club?.name === filters.club
        })
      } else {
        results = results.filter(p => p.club_id === filters.club)
      }
    }

    if (filters.position) {
      results = results.filter(p => p.position === filters.position)
    }

    if (filters.status) {
      results = results.filter(p => {
        if (filters.status === 'eligible') return p.status === 'eligible'
        if (filters.status === 'pending') return p.status === 'pending'
        if (filters.status === 'ineligible') return p.status === 'ineligible'
        return true
      })
    }

    if (filters.availability) {
      results = results.filter(p => p.availability === filters.availability)
    }

    if (filters.nationality) {
      results = results.filter(p => p.nationality === filters.nationality)
    }

    return results
  }

  // Calculate player age
  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return {
    players,
    loading,
    error,
    loadPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    searchPlayers,
    calculateAge
  }
})
