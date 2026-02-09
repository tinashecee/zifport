# ZIFA Portal Database Schema

## Overview
This directory contains MySQL database scripts for the ZIFA Player Registration System.

## Files

- **schema.sql** - Main database schema with all table definitions
- **insert_initial_data.sql** - Initial data insertion (roles, demo users, sample data)

## Database Structure

### Core Tables

1. **roles** - User roles and permissions
2. **users** - System users (admin, club admins, regular users)
3. **clubs** - Football clubs in Zimbabwe
4. **players** - Comprehensive player information and statistics
5. **coaches** - Coach information and qualifications
6. **referees** - Referee information and availability

### Supporting Tables

- **player_statistics** - Historical player statistics by season/competition
- **audit_logs** - System audit trail for all changes

## Installation

### Step 1: Create Database
```bash
mysql -u root -p < database/schema.sql
```

### Step 2: Insert Initial Data
```bash
mysql -u root -p < database/insert_initial_data.sql
```

### Or run both at once:
```bash
mysql -u root -p < database/schema.sql && mysql -u root -p < database/insert_initial_data.sql
```

## Database Configuration

Update your application's database configuration with:
- **Host:** localhost (or your MySQL server)
- **Database:** zifa_portal
- **Username:** your_mysql_username
- **Password:** your_mysql_password
- **Port:** 3306 (default)

## Key Features

### Players Table
- Comprehensive statistics (international appearances, goals, assists)
- Season and all-time statistics
- Contract information
- Injury and availability status
- Document storage (JSON)
- Auto-calculated age from date of birth

### Indexes
All tables include proper indexes for:
- Primary keys
- Foreign keys
- Frequently queried fields (name, status, club, etc.)

### Data Integrity
- Foreign key constraints
- Unique constraints on ZIFA IDs
- Check constraints on ENUM fields
- Auto-updating timestamps

## Demo Accounts

After running `insert_initial_data.sql`, you can login with:

- **Admin:** admin@zifa.org.zw / admin123
- **Club Admin:** club@zifa.org.zw / club123
- **User:** user@zifa.org.zw / user123

**Note:** In production, passwords should be properly hashed using bcrypt or similar.

## Extending the Schema

To add more fields to players table:
```sql
ALTER TABLE players 
ADD COLUMN new_field_name VARCHAR(255) AFTER existing_field;
```

## Backup and Restore

### Backup:
```bash
mysqldump -u root -p zifa_portal > zifa_portal_backup.sql
```

### Restore:
```bash
mysql -u root -p zifa_portal < zifa_portal_backup.sql
```

## Notes

- All tables use InnoDB engine for foreign key support
- UTF8MB4 charset for full Unicode support
- Timestamps auto-update on record modification
- Soft deletes using `is_active` flag (recommended over hard deletes)
