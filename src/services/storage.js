// LocalStorage wrapper for data persistence

const STORAGE_KEYS = {
  PLAYERS: 'zifa_players',
  COACHES: 'zifa_coaches',
  REFEREES: 'zifa_referees',
  USERS: 'zifa_users',
  AUTH: 'zifa_auth'
}

export const storageService = {
  // Generic CRUD operations
  get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error)
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error)
      return false
    }
  },

  // Entity-specific operations
  getPlayers() {
    return this.get(STORAGE_KEYS.PLAYERS) || []
  },

  savePlayers(players) {
    return this.set(STORAGE_KEYS.PLAYERS, players)
  },

  getCoaches() {
    return this.get(STORAGE_KEYS.COACHES) || []
  },

  saveCoaches(coaches) {
    return this.set(STORAGE_KEYS.COACHES, coaches)
  },

  getReferees() {
    return this.get(STORAGE_KEYS.REFEREES) || []
  },

  saveReferees(referees) {
    return this.set(STORAGE_KEYS.REFEREES, referees)
  },

  getUsers() {
    return this.get(STORAGE_KEYS.USERS) || []
  },

  saveUsers(users) {
    return this.set(STORAGE_KEYS.USERS, users)
  },

  getAuth() {
    return this.get(STORAGE_KEYS.AUTH)
  },

  saveAuth(auth) {
    return this.set(STORAGE_KEYS.AUTH, auth)
  },

  clearAuth() {
    return this.remove(STORAGE_KEYS.AUTH)
  }
}
