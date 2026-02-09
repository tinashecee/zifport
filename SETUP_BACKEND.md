# Backend Setup Instructions

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on **http://localhost:3001**

### 3. Test the Connection

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Should return:
# {"status":"ok","database":"connected","timestamp":"..."}
```

## Database Connection

The backend is configured to connect to:
- **Host:** 161.97.183.92
- **Database:** zifa_portal
- **User:** remote_user
- **Password:** @Soxfort2025##

Connection settings are in `backend/config/database.js` and `backend/.env`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/verify` - Verify token

### Players
- `GET /api/players` - List players (with filters)
- `GET /api/players/:id` - Get player
- `POST /api/players` - Create player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Coaches
- `GET /api/coaches` - List coaches
- `GET /api/coaches/:id` - Get coach
- `POST /api/coaches` - Create coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach

### Referees
- `GET /api/referees` - List referees
- `GET /api/referees/:id` - Get referee
- `POST /api/referees` - Create referee
- `PUT /api/referees/:id` - Update referee
- `DELETE /api/referees/:id` - Delete referee

### Clubs
- `GET /api/clubs` - List clubs
- `GET /api/clubs/:id` - Get club

## Frontend Integration

The Vue.js frontend has been set up with an API service (`src/services/api.js`) that connects to the backend.

To use the backend API instead of localStorage:

1. Make sure the backend is running on port 3001
2. Update your Vue stores to use the API service instead of localStorage
3. The API service handles authentication tokens automatically

## Troubleshooting

### Connection Issues

If you get connection errors:

1. **Check MySQL is accessible:**
   ```bash
   mysql -h 161.97.183.92 -u remote_user -p
   ```

2. **Check firewall:** Ensure port 3306 (MySQL) is open

3. **Check database exists:**
   ```sql
   SHOW DATABASES;
   USE zifa_portal;
   SHOW TABLES;
   ```

### CORS Issues

If you get CORS errors, the backend already has CORS enabled. Make sure:
- Backend is running on port 3001
- Frontend is making requests to `http://localhost:3001/api`

## Next Steps

1. Start the backend server
2. Test the API endpoints
3. Update Vue stores to use the API service
4. Test login/registration flow
