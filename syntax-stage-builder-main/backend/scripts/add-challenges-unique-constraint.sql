-- Add unique constraint to challenges table
-- This allows the seed script to use ON CONFLICT

-- First, remove any potential duplicates (keep the most recently updated one)
DELETE FROM challenges a
USING challenges b
WHERE a.id < b.id
AND a.title = b.title
AND a.language = b.language;

-- Add the unique constraint
ALTER TABLE challenges
ADD CONSTRAINT challenges_title_language_unique UNIQUE (title, language);

-- Verify
SELECT 
    constraint_name, 
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'challenges';
