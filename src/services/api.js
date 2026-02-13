// API Service for connecting to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://161.97.183.92:3001/api'

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || 'Invalid response from server')
    }

    if (!response.ok) {
      const msg = data.message ? `${data.error} ${data.message}` : (data.error || `API request failed: ${response.status} ${response.statusText}`)
      throw new Error(msg)
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle connection errors
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('Cannot connect to server. Please make sure the backend server is running on http://localhost:3001')
    }
    
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (data.token) {
      setAuthToken(data.token)
    }
    return data
  },

  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (data.token) {
      setAuthToken(data.token)
    }
    return data
  },

  verify: async () => {
    return await apiRequest('/auth/verify')
  },

  logout: () => {
    setAuthToken(null)
  }
}

// Players API
export const playersAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const data = await apiRequest(`/players${params ? `?${params}` : ''}`)
    // Handle both array response and object with players property
    return Array.isArray(data) ? data : (data.players || data)
  },

  getById: async (id) => {
    return await apiRequest(`/players/${id}`)
  },

  create: async (playerData) => {
    return await apiRequest('/players', {
      method: 'POST',
      body: JSON.stringify(playerData)
    })
  },

  update: async (id, playerData) => {
    return await apiRequest(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData)
    })
  },

  delete: async (id) => {
    return await apiRequest(`/players/${id}`, {
      method: 'DELETE'
    })
  }
}

// Coaches API
export const coachesAPI = {
  getAll: async () => {
    return await apiRequest('/coaches')
  },

  getById: async (id) => {
    return await apiRequest(`/coaches/${id}`)
  },

  create: async (coachData) => {
    return await apiRequest('/coaches', {
      method: 'POST',
      body: JSON.stringify(coachData)
    })
  },

  update: async (id, coachData) => {
    return await apiRequest(`/coaches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coachData)
    })
  },

  delete: async (id) => {
    return await apiRequest(`/coaches/${id}`, {
      method: 'DELETE'
    })
  }
}

// Referees API
export const refereesAPI = {
  getAll: async () => {
    return await apiRequest('/referees')
  },

  getById: async (id) => {
    return await apiRequest(`/referees/${id}`)
  },

  create: async (refereeData) => {
    return await apiRequest('/referees', {
      method: 'POST',
      body: JSON.stringify(refereeData)
    })
  },

  update: async (id, refereeData) => {
    return await apiRequest(`/referees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(refereeData)
    })
  },

  delete: async (id) => {
    return await apiRequest(`/referees/${id}`, {
      method: 'DELETE'
    })
  }
}

// Clubs API
export const clubsAPI = {
  getAll: async () => {
    const data = await apiRequest('/clubs')
    return data.clubs ?? data
  },

  getById: async (id) => {
    const data = await apiRequest(`/clubs/${id}`)
    return data.club ?? data
  },

  create: async (clubData) => {
    return await apiRequest('/clubs', {
      method: 'POST',
      body: JSON.stringify(clubData)
    })
  }
}

export default {
  authAPI,
  playersAPI,
  coachesAPI,
  refereesAPI,
  clubsAPI,
  setAuthToken,
  getAuthToken
}
