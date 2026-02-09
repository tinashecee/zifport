-- ZIFA Player Registration System Database Schema
-- MySQL Database Creation Script

-- Create Database
CREATE DATABASE IF NOT EXISTS zifa_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zifa_portal;

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role_id),
    INDEX idx_user_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CLUBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clubs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    abbreviation VARCHAR(10),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Zimbabwe',
    founded_year YEAR,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_club_name (name),
    INDEX idx_club_city (city),
    INDEX idx_club_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PLAYERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    zifa_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) DEFAULT 'Zimbabwean',
    dual_nationality VARCHAR(100),
    position ENUM('GK', 'DF', 'MF', 'FW') NOT NULL,
    preferred_foot ENUM('Left', 'Right', 'Both'),
    height_cm INT,
    weight_kg DECIMAL(5,2),
    
    -- Club Information
    club_id INT,
    contract_start_date DATE,
    contract_end_date DATE,
    jersey_number INT,
    
    -- Statistics
    international_appearances INT DEFAULT 0,
    international_goals INT DEFAULT 0,
    season_goals INT DEFAULT 0,
    all_time_goals INT DEFAULT 0,
    season_assists INT DEFAULT 0,
    all_time_assists INT DEFAULT 0,
    games_played INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Status & Eligibility
    status ENUM('eligible', 'pending', 'ineligible') DEFAULT 'pending',
    availability ENUM('available', 'injured', 'unavailable', 'suspended') DEFAULT 'available',
    injury_status VARCHAR(255),
    suspension_end_date DATE,
    
    -- Documents & Media
    passport_number VARCHAR(50),
    passport_expiry_date DATE,
    photo_url VARCHAR(500),
    documents JSON,
    
    -- Additional Information
    bio TEXT,
    achievements TEXT,
    notes TEXT,
    
    -- Metadata
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_player_zifa_id (zifa_id),
    INDEX idx_player_name (first_name, last_name),
    INDEX idx_player_club (club_id),
    INDEX idx_player_position (position),
    INDEX idx_player_status (status),
    INDEX idx_player_availability (availability),
    INDEX idx_player_nationality (nationality),
    INDEX idx_player_active (is_active),
    INDEX idx_player_dob (date_of_birth)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- COACHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS coaches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    zifa_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(100) DEFAULT 'Zimbabwean',
    
    -- License & Qualifications
    license_level ENUM('CAF A', 'CAF B', 'CAF C', 'FIFA', 'Local') NOT NULL,
    license_number VARCHAR(50),
    license_expiry_date DATE,
    certifications JSON,
    
    -- Experience
    years_of_experience INT DEFAULT 0,
    previous_clubs TEXT,
    achievements TEXT,
    
    -- Current Assignment
    club_id INT,
    team_type ENUM('Senior', 'Youth', 'Women', 'Academy'),
    contract_start_date DATE,
    contract_end_date DATE,
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    
    -- Status
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    availability ENUM('available', 'unavailable') DEFAULT 'available',
    
    -- Documents
    photo_url VARCHAR(500),
    documents JSON,
    
    -- Additional Information
    bio TEXT,
    notes TEXT,
    
    -- Metadata
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_coach_zifa_id (zifa_id),
    INDEX idx_coach_name (first_name, last_name),
    INDEX idx_coach_club (club_id),
    INDEX idx_coach_license (license_level),
    INDEX idx_coach_status (status),
    INDEX idx_coach_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- REFEREES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS referees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    zifa_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(100) DEFAULT 'Zimbabwean',
    
    -- License & Qualifications
    license_level ENUM('FIFA', 'CAF Elite', 'CAF A', 'CAF B', 'Local') NOT NULL,
    license_number VARCHAR(50),
    license_expiry_date DATE,
    certifications JSON,
    
    -- Experience
    years_of_experience INT DEFAULT 0,
    matches_officiated INT DEFAULT 0,
    international_matches INT DEFAULT 0,
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    
    -- Status & Availability
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    availability ENUM('available', 'limited', 'unavailable') DEFAULT 'available',
    
    -- Documents
    photo_url VARCHAR(500),
    documents JSON,
    
    -- Additional Information
    bio TEXT,
    notes TEXT,
    
    -- Metadata
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_referee_zifa_id (zifa_id),
    INDEX idx_referee_name (first_name, last_name),
    INDEX idx_referee_license (license_level),
    INDEX idx_referee_status (status),
    INDEX idx_referee_availability (availability),
    INDEX idx_referee_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PLAYER STATISTICS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS player_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    season VARCHAR(20) NOT NULL,
    competition_type ENUM('League', 'Cup', 'International', 'Friendly', 'Other') NOT NULL,
    competition_name VARCHAR(255),
    
    -- Match Statistics
    matches_played INT DEFAULT 0,
    matches_started INT DEFAULT 0,
    minutes_played INT DEFAULT 0,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    clean_sheets INT DEFAULT 0, -- For goalkeepers and defenders
    
    -- Performance Metrics
    shots INT DEFAULT 0,
    shots_on_target INT DEFAULT 0,
    passes_completed INT DEFAULT 0,
    pass_accuracy DECIMAL(5,2),
    
    -- Additional Stats
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    INDEX idx_stat_player (player_id),
    INDEX idx_stat_season (season),
    INDEX idx_stat_competition (competition_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    entity_type ENUM('player', 'coach', 'referee', 'user', 'club') NOT NULL,
    entity_id INT NOT NULL,
    changes JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_action (action_type),
    INDEX idx_audit_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VIEW: PLAYERS WITH CALCULATED AGE
-- ============================================
CREATE OR REPLACE VIEW players_with_age AS
SELECT 
    p.*,
    TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) - 
    (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(p.date_of_birth, '%m%d')) AS age
FROM players p;
