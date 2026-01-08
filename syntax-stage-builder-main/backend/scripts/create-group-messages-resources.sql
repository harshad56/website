-- Create group_messages table
CREATE TABLE IF NOT EXISTS group_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id BIGINT REFERENCES study_groups(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_resources table
CREATE TABLE IF NOT EXISTS group_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id BIGINT REFERENCES study_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'link', -- link, file, video
    url TEXT NOT NULL,
    added_by VARCHAR(255) NOT NULL, -- email
    added_by_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) if needed, but for now assuming public/authenticated access control via API
-- ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE group_resources ENABLE ROW LEVEL SECURITY;

-- Add meeting_link column to study_groups table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'study_groups' AND column_name = 'meeting_link') THEN
        ALTER TABLE study_groups ADD COLUMN meeting_link TEXT;
    END IF;
END $$;
