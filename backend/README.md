# ZIFA Portal Backend API

Backend API server for the ZIFA Player Registration System.

## Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Start Server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify` - Verify JWT token

### Players
- `GET /api/players` - Get all players (with filters)
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player (soft delete)

### Coaches
- `GET /api/coaches` - Get all coaches
- `GET /api/coaches/:id` - Get coach by ID
- `POST /api/coaches` - Create new coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach

### Referees
- `GET /api/referees` - Get all referees
- `GET /api/referees/:id` - Get referee by ID
- `POST /api/referees` - Create new referee
- `PUT /api/referees/:id` - Update referee
- `DELETE /api/referees/:id` - Delete referee

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID

### Users
- `GET /api/users` - Get all users (admin only)

### Health Check
- `GET /api/health` - Check API and database status

## Database Connection

The API connects to MySQL database at:
- **Host:** 161.97.183.92
- **Database:** zifa_portal
- **User:** remote_user

## Example Requests

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zifa.org.zw","password":"admin123"}'
```

### Get Players
```bash
curl http://localhost:3001/api/players
```

### Create Player
```bash
curl -X POST http://localhost:3001/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1995-01-15",
    "position": "FW",
    "nationality": "Zimbabwean"
  }'
```

## Frontend Integration

Update your Vue.js frontend to use this API instead of localStorage. The API runs on port 3001 by default.
