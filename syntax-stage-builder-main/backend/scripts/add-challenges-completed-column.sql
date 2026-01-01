-- Add challenges_completed column to user_progress table
-- This column tracks how many challenges each user has completed

ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS challenges_completed INTEGER DEFAULT 0;

-- Update existing records to count their completed challenges
UPDATE user_progress up
SET challenges_completed = (
    SELECT COUNT(*)
    FROM user_challenge_progress ucp
    WHERE ucp.user_id = up.user_id
    AND ucp.status = 'completed'
);

-- Verify the update
SELECT 
    user_id,
    total_points,
    challenges_completed,
    last_activity
FROM user_progress
ORDER BY total_points DESC
LIMIT 10;
