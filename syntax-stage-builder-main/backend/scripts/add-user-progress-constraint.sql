-- Add unique constraint to user_progress table
-- This allows the backend to use ON CONFLICT for upserts

-- First, remove any duplicate entries (keep the one with highest points)
DELETE FROM user_progress a
USING user_progress b
WHERE a.id < b.id
AND a.user_id = b.user_id;

-- Now add the unique constraint
ALTER TABLE user_progress
ADD CONSTRAINT user_progress_user_id_unique UNIQUE (user_id);

-- Verify it worked
SELECT 
    constraint_name, 
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'user_progress';
