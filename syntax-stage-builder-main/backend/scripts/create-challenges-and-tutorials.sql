-- Migration: Create tables for Challenges and Tutorials
-- Path: backend/scripts/create-challenges-and-tutorials.sql

-- 1. Challenges Table (for both Coding and Algorithm challenges)
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    problem_statement TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
    language VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'coding', 'algorithm'
    starter_code TEXT,
    solution_code TEXT,
    test_cases JSONB DEFAULT '[]', -- Array of {input, expected, description}
    hints JSONB DEFAULT '[]', -- Array of strings
    points INTEGER DEFAULT 50,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. User Challenge Progress Table
CREATE TABLE IF NOT EXISTS user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'started', -- 'started', 'completed'
    submitted_code TEXT,
    attempts_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP DEFAULT NOW(),
    completion_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- 3. Tutorials Table
CREATE TABLE IF NOT EXISTS tutorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    badge VARCHAR(50), -- e.g., 'Beginner', 'Hands-on', 'Challenge'
    language VARCHAR(50),
    difficulty VARCHAR(20) DEFAULT 'beginner',
    lessons_count INTEGER DEFAULT 0,
    duration_label VARCHAR(50), -- e.g., '6h total', '45 min'
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tutorial Steps Table
CREATE TABLE IF NOT EXISTS tutorial_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_md TEXT NOT NULL,
    interactive_check JSONB, -- Optional: {type: 'code', expected_output: '...'}
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_challenges_category ON challenges(category);
CREATE INDEX idx_challenges_language ON challenges(language);
CREATE INDEX idx_user_challenge_progress_user ON user_challenge_progress(user_id);
CREATE INDEX idx_tutorials_is_published ON tutorials(is_published);
CREATE INDEX idx_tutorial_steps_tutorial_id ON tutorial_steps(tutorial_id);

-- Apply updated_at trigger
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_challenge_progress_updated_at BEFORE UPDATE ON user_challenge_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutorial_steps_updated_at BEFORE UPDATE ON tutorial_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
