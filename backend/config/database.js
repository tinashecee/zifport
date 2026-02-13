// MySQL Database Configuration
import mysql from 'mysql2/promise'

const dbConfig = {
  host: '161.97.183.92',
  user: 'remote_user',
  password: '@Soxfort2025##',
  database: 'zifa_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Log pool errors (e.g. connection drops); pool will remove dead connections
pool.on('error', (err) => {
  console.error('MySQL pool error:', err.code || err.message)
})

// Test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database connected successfully')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

// Connection errors that often mean the server closed an idle connection - safe to retry once
const isConnectionError = (err) => {
  const code = err?.code || err?.errno
  return (
    code === 'ECONNRESET' ||
    code === 'PROTOCOL_CONNECTION_LOST' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNREFUSED' ||
    err?.message?.includes('Connection lost')
  )
}

// Execute query helper with one retry on connection drop (e.g. remote MySQL closing idle connections)
export const query = async (sql, params = [], retried = false) => {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    if (!retried && isConnectionError(error)) {
      console.warn('Database connection error, retrying once:', error.code || error.message)
      return query(sql, params, true)
    }
    console.error('Database query error:', error)
    throw error
  }
}

// Get connection from pool
export const getConnection = async () => {
  return await pool.getConnection()
}

export default pool
