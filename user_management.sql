-- ============================================
-- USER MANAGEMENT SQL COMMANDS
-- For Supabase PostgreSQL Database
-- ============================================

-- 1. CREATE NEW USER
-- Replace 'your_password_here' with the actual password
INSERT INTO users (password, created_at)
VALUES ('your_password_here', NOW())
RETURNING *;

-- Example:
-- INSERT INTO users (password, created_at)
-- VALUES ('mySecurePassword123', NOW())
-- RETURNING *;


-- 2. VIEW ALL USERS
SELECT id, password, created_at 
FROM users 
ORDER BY created_at DESC;


-- 3. VIEW SPECIFIC USER BY ID
-- Replace 'user_id_here' with the actual user ID
SELECT * 
FROM users 
WHERE id = 'user_id_here';


-- 4. VIEW SPECIFIC USER BY PASSWORD
-- Replace 'password_here' with the actual password
SELECT * 
FROM users 
WHERE password = 'password_here';


-- 5. UPDATE USER PASSWORD
-- Replace 'user_id_here' with the actual user ID
-- Replace 'new_password_here' with the new password
UPDATE users 
SET password = 'new_password_here'
WHERE id = 'user_id_here'
RETURNING *;

-- Example:
-- UPDATE users 
-- SET password = 'newSecurePassword456'
-- WHERE id = '123e4567-e89b-12d3-a456-426614174000'
-- RETURNING *;


-- 6. DELETE USER BY ID
-- Replace 'user_id_here' with the actual user ID
-- WARNING: This will also delete all associated plans and notifications
DELETE FROM users 
WHERE id = 'user_id_here'
RETURNING *;

-- Example:
-- DELETE FROM users 
-- WHERE id = '123e4567-e89b-12d3-a456-426614174000'
-- RETURNING *;


-- 7. DELETE USER BY PASSWORD
-- Replace 'password_here' with the actual password
DELETE FROM users 
WHERE password = 'password_here'
RETURNING *;


-- 8. COUNT TOTAL USERS
SELECT COUNT(*) as total_users 
FROM users;


-- 9. VIEW USERS WITH THEIR PLAN COUNT
SELECT 
    u.id,
    u.password,
    u.created_at,
    COUNT(p.id) as total_plans
FROM users u
LEFT JOIN plans p ON u.id = p.user_id
GROUP BY u.id, u.password, u.created_at
ORDER BY u.created_at DESC;


-- 10. DELETE INACTIVE USERS (no plans created)
-- Use with caution!
DELETE FROM users 
WHERE id NOT IN (
    SELECT DISTINCT user_id 
    FROM plans
)
RETURNING *;


-- ============================================
-- USEFUL QUERIES FOR ADMINISTRATION
-- ============================================

-- Find users created in the last 7 days
SELECT * 
FROM users 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Find users with most plans
SELECT 
    u.id,
    u.password,
    COUNT(p.id) as plan_count
FROM users u
LEFT JOIN plans p ON u.id = p.user_id
GROUP BY u.id, u.password
ORDER BY plan_count DESC
LIMIT 10;

-- Check if a password already exists (before creating user)
SELECT EXISTS(
    SELECT 1 
    FROM users 
    WHERE password = 'password_to_check'
) as password_exists;


-- ============================================
-- NOTES
-- ============================================
-- 1. Always backup your database before running DELETE operations
-- 2. The 'id' field is a UUID generated automatically
-- 3. Use Supabase SQL Editor to run these queries
-- 4. RETURNING * shows the affected rows after INSERT/UPDATE/DELETE
-- 5. Deleting a user will cascade delete their plans and notifications
--    (if foreign key constraints are set up properly)
