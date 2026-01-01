-- Seed User Progress Data for Leaderboard (FIXED VERSION)
-- This version works even if user_id is not a unique constraint

-- First, get some actual user IDs from your users table
-- Run this query first to see your users:
-- SELECT id, email, name FROM users ORDER BY created_at DESC LIMIT 10;

-- Then replace the UUIDs below with real user IDs

-- Delete any existing test data (optional)
-- DELETE FROM user_progress WHERE user_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

-- Insert sample user progress with points
-- IMPORTANT: Replace these UUIDs with actual user IDs from your users table!

-- Method 1: If you have real user IDs, use this:
INSERT INTO user_progress (user_id, total_points, challenges_completed, last_activity)
VALUES
  ('REPLACE-WITH-REAL-USER-ID-1', 450, 9, NOW()),
  ('REPLACE-WITH-REAL-USER-ID-2', 380, 7, NOW()),
  ('REPLACE-WITH-REAL-USER-ID-3', 320, 6, NOW()),
  ('REPLACE-WITH-REAL-USER-ID-4', 275, 5, NOW()),
  ('REPLACE-WITH-REAL-USER-ID-5', 210, 4, NOW());

-- Method 2: Quick test with random UUIDs (will show as "Anonymous" in leaderboard)
-- Uncomment the lines below if you just want to test quickly:

-- INSERT INTO user_progress (user_id, total_points, challenges_completed, last_activity)
-- VALUES
--   (gen_random_uuid(), 450, 9, NOW()),
--   (gen_random_uuid(), 380, 7, NOW()),
--   (gen_random_uuid(), 320, 6, NOW()),
--   (gen_random_uuid(), 275, 5, NOW()),
--   (gen_random_uuid(), 210, 4, NOW());

-- Verify the leaderboard data:
SELECT 
  up.total_points,
  up.challenges_completed,
  up.user_id,
  u.name,
  u.avatar
FROM user_progress up
LEFT JOIN users u ON up.user_id = u.id
ORDER BY up.total_points DESC
LIMIT 10;
