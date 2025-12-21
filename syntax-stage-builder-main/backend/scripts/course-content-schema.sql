-- Course Content Schema - Videos, Documents, Lessons
-- Run this in your Supabase SQL Editor

-- Course Lessons table (individual lessons within a module)
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50) NOT NULL DEFAULT 'video', -- 'video', 'document', 'quiz', 'assignment'
    order_index INTEGER NOT NULL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT FALSE, -- Free preview lesson
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course Videos table
CREATE TABLE IF NOT EXISTS course_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL, -- YouTube, Vimeo, or direct video URL
    video_provider VARCHAR(50) DEFAULT 'youtube', -- 'youtube', 'vimeo', 'direct', 'custom'
    video_id VARCHAR(255), -- For YouTube/Vimeo video IDs
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    transcript TEXT, -- Video transcript/subtitles
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course Documents table
CREATE TABLE IF NOT EXISTS course_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL, -- PDF, DOCX, or other document URL
    document_type VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'docx', 'txt', 'link'
    file_size INTEGER, -- Size in bytes
    download_allowed BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course Resources table (additional resources like code files, templates, etc.)
CREATE TABLE IF NOT EXISTS course_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    resource_url TEXT NOT NULL,
    resource_type VARCHAR(50) DEFAULT 'file', -- 'file', 'link', 'code', 'template'
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Course Enrollments table
CREATE TABLE IF NOT EXISTS user_course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'free', -- 'free', 'paid', 'trial'
    payment_id UUID, -- Reference to payment if paid
    UNIQUE(user_id, course_id)
);

-- User Lesson Progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES user_course_enrollments(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    watched_duration_seconds INTEGER DEFAULT 0, -- For videos
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON course_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_videos_lesson ON course_videos(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_documents_lesson ON course_documents(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_lesson ON course_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user ON user_course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_course ON user_course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_enrollment ON user_lesson_progress(enrollment_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_lessons_updated_at BEFORE UPDATE ON course_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_videos_updated_at BEFORE UPDATE ON course_videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_documents_updated_at BEFORE UPDATE ON course_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_resources_updated_at BEFORE UPDATE ON course_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();






