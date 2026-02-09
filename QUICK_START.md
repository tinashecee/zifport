# ZIFA Portal - Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MySQL database running and accessible
- npm or yarn

## Step 1: Install Frontend Dependencies

```bash
npm install
```

## Step 2: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

## Step 3: Start Backend Server

**IMPORTANT:** The backend must be running before using the application!

```bash
cd backend
npm run dev
```

The backend will start on **http://localhost:3001**

You should see:
```
🚀 ZIFA Portal API server running on port 3001
📡 Database: 161.97.183.92/zifa_portal
🌐 API URL: http://localhost:3001
```

## Step 4: Start Frontend Development Server

In a **new terminal window**:

```bash
npm run dev
```

The frontend will start on **http://localhost:3000** (or another port if 3000 is busy)

## Step 5: Test the Connection

1. Open your browser to the frontend URL (usually http://localhost:3000)
2. Try to login with:
   - Email: `admin@zifa.org.zw`
   - Password: `admin123`

## Troubleshooting

### Backend Connection Refused Error

If you see `ERR_CONNECTION_REFUSED`:

1. **Check if backend is running:**
   ```bash
   # In backend directory
   npm run dev
   ```

2. **Check backend logs** for any errors

3. **Verify database connection:**
   - Make sure MySQL is accessible at `161.97.183.92`
   - Test connection: `mysql -h 161.97.183.92 -u remote_user -p`

4. **Check port 3001 is available:**
   - Make sure nothing else is using port 3001
   - You can change the port in `backend/.env` if needed

### Database Connection Issues

If backend can't connect to database:

1. Check database credentials in `backend/.env`
2. Verify MySQL user has proper permissions:
   ```sql
   GRANT ALL PRIVILEGES ON zifa_portal.* TO 'remote_user'@'%';
   FLUSH PRIVILEGES;
   ```

3. Check firewall settings allow connection to port 3306

### Frontend Can't Connect to Backend

1. Make sure backend is running on port 3001
2. Check `src/services/api.js` - API_BASE_URL should be `http://localhost:3001/api`
3. Check browser console for CORS errors (backend has CORS enabled)

## Running Both Servers

You need **two terminal windows**:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## Production Setup

For production, you'll need to:
1. Build the frontend: `npm run build`
2. Serve backend with PM2 or similar: `pm2 start backend/server.js`
3. Configure environment variables
4. Set up proper domain/URLs
