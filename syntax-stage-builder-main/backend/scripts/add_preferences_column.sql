-- Add preferences column to users table if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"preferredLanguage": "python", "difficulty": "beginner", "notifications": true}'::jsonb;

-- Comment on column
COMMENT ON COLUMN public.users.preferences IS 'User preferences for learning settings';
