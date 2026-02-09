-- ZIFA Portal - Initial Data Insertion
-- Insert default roles and demo users

USE zifa_portal;

-- ============================================
-- INSERT DEFAULT ROLES
-- ============================================
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrator', '{"all": true, "manage_users": true, "manage_players": true, "manage_coaches": true, "manage_referees": true, "view_reports": true}'),
('club', 'Club Administrator', '{"manage_players": true, "manage_coaches": true, "view_reports": true, "register_members": true}'),
('user', 'Regular User', '{"view_players": true, "register_members": true, "view_dashboard": true}')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ============================================
-- INSERT DEMO USERS
-- ============================================
-- Note: Passwords should be hashed in production. These are demo passwords.
-- Password: admin123 (should be bcrypt hash in production)
INSERT INTO users (email, password, name, role_id, phone, is_active) VALUES
('admin@zifa.org.zw', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 1, '+263-4-XXX-XXXX', TRUE),
('club@zifa.org.zw', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Club Administrator', 2, '+263-4-XXX-XXXX', TRUE),
('user@zifa.org.zw', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Regular User', 3, '+263-4-XXX-XXXX', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- INSERT SAMPLE CLUBS
-- ============================================
INSERT INTO clubs (name, abbreviation, city, founded_year, contact_email, contact_phone, is_active) VALUES
('Dynamos FC', 'DYN', 'Harare', 1963, 'info@dynamosfc.co.zw', '+263-4-XXX-XXXX', TRUE),
('Highlanders FC', 'HIG', 'Bulawayo', 1926, 'info@highlandersfc.co.zw', '+263-9-XXX-XXXX', TRUE),
('CAPS United', 'CAPS', 'Harare', 1973, 'info@capsunited.co.zw', '+263-4-XXX-XXXX', TRUE),
('FC Platinum', 'FCP', 'Zvishavane', 1995, 'info@fcplatinum.co.zw', '+263-XXX-XXXX', TRUE),
('Ngezi Platinum Stars', 'NPS', 'Mhondoro', 2013, 'info@ngeziplatinum.co.zw', '+263-XXX-XXXX', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- INSERT SAMPLE PLAYERS
-- ============================================
INSERT INTO players (
    zifa_id, first_name, last_name, date_of_birth, nationality, position,
    club_id, jersey_number, international_appearances, international_goals,
    season_goals, all_time_goals, season_assists, all_time_assists,
    games_played, status, availability, email, phone
) VALUES
('ZIFA-00001', 'Tino', 'Kadewere', '1996-01-05', 'Zimbabwean', 'FW', 1, 9, 25, 8, 12, 45, 5, 18, 120, 'eligible', 'available', 'tino.kadewere@example.com', '+263-77-XXX-XXXX'),
('ZIFA-00002', 'Knowledge', 'Musona', '1990-06-21', 'Zimbabwean', 'FW', 2, 7, 45, 23, 8, 89, 3, 25, 180, 'eligible', 'available', 'knowledge.musona@example.com', '+263-77-XXX-XXXX'),
('ZIFA-00003', 'Marvelous', 'Nakamba', '1994-01-19', 'Zimbabwean', 'MF', 3, 6, 30, 2, 2, 8, 4, 12, 95, 'eligible', 'available', 'marvelous.nakamba@example.com', '+263-77-XXX-XXXX'),
('ZIFA-00004', 'Tatenda', 'Mukuruva', '1996-05-14', 'Zimbabwean', 'GK', 1, 1, 15, 0, 0, 0, 0, 0, 60, 'eligible', 'available', 'tatenda.mukuruva@example.com', '+263-77-XXX-XXXX'),
('ZIFA-00005', 'Teenage', 'Hadebe', '1995-09-17', 'Zimbabwean', 'DF', 2, 5, 28, 1, 1, 3, 1, 2, 110, 'eligible', 'available', 'teenage.hadebe@example.com', '+263-77-XXX-XXXX')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- ============================================
-- INSERT SAMPLE COACHES
-- ============================================
INSERT INTO coaches (
    zifa_id, first_name, last_name, license_level, club_id, team_type,
    years_of_experience, email, phone, status, availability
) VALUES
('ZIFA-COACH-001', 'Norman', 'Mapeza', 'CAF A', 1, 'Senior', 15, 'norman.mapeza@example.com', '+263-77-XXX-XXXX', 'active', 'available'),
('ZIFA-COACH-002', 'Baltemar', 'Brito', 'CAF A', 2, 'Senior', 20, 'baltemar.brito@example.com', '+263-77-XXX-XXXX', 'active', 'available'),
('ZIFA-COACH-003', 'Lloyd', 'Chitembwe', 'CAF B', 3, 'Senior', 12, 'lloyd.chitembwe@example.com', '+263-77-XXX-XXXX', 'active', 'available')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- ============================================
-- INSERT SAMPLE REFEREES
-- ============================================
INSERT INTO referees (
    zifa_id, first_name, last_name, license_level, years_of_experience,
    matches_officiated, international_matches, email, phone, status, availability
) VALUES
('ZIFA-REF-001', 'Norman', 'Mareya', 'CAF A', 10, 150, 5, 'norman.mareya@example.com', '+263-77-XXX-XXXX', 'active', 'available'),
('ZIFA-REF-002', 'Ruzive', 'Ruzive', 'CAF B', 8, 120, 2, 'ruzive.ruzive@example.com', '+263-77-XXX-XXXX', 'active', 'available'),
('ZIFA-REF-003', 'Thabani', 'Bamala', 'CAF A', 12, 200, 8, 'thabani.bamala@example.com', '+263-77-XXX-XXXX', 'active', 'available')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);
