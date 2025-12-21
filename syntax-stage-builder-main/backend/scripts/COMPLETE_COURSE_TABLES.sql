-- =====================================================
-- COMPLETE COURSE CONTENT SYSTEM - SQL SCRIPT
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- Step 1: Ensure modules table exists (if not already created)
-- This table should already exist from your main schema, but adding it here for safety
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create Course Lessons table (individual lessons within a module)
CREATE TABLE IF NOT EXISTS public.course_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
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

-- Step 3: Create Course Videos table
CREATE TABLE IF NOT EXISTS public.course_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    video_url TEXT, -- YouTube, Vimeo, or direct video URL (nullable if using video_id)
    video_provider VARCHAR(50) DEFAULT 'youtube', -- 'youtube', 'vimeo', 'direct', 'custom'
    video_id VARCHAR(255), -- For YouTube/Vimeo video IDs
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    transcript TEXT, -- Video transcript/subtitles
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Create Course Documents table
CREATE TABLE IF NOT EXISTS public.course_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL, -- PDF, DOCX, or other document URL
    document_type VARCHAR(50) DEFAULT 'pdf', -- 'pdf', 'docx', 'txt', 'link'
    file_size INTEGER, -- Size in bytes
    download_allowed BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 5: Create Course Resources table (additional resources like code files, templates, etc.)
CREATE TABLE IF NOT EXISTS public.course_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    resource_url TEXT NOT NULL,
    resource_type VARCHAR(50) DEFAULT 'file', -- 'file', 'link', 'code', 'template'
    description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 6: Create User Course Enrollments table
CREATE TABLE IF NOT EXISTS public.user_course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'free', -- 'free', 'paid', 'trial'
    payment_id UUID, -- Reference to payment if paid
    UNIQUE(user_id, course_id)
);

-- Step 7: Create User Lesson Progress table
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.user_course_enrollments(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    watched_duration_seconds INTEGER DEFAULT 0, -- For videos
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Step 8: Create Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON public.course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_order ON public.course_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_course_videos_lesson ON public.course_videos(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_documents_lesson ON public.course_documents(lesson_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_lesson ON public.course_resources(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user ON public.user_course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_course ON public.user_course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON public.user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON public.user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_enrollment ON public.user_lesson_progress(enrollment_id);

-- Step 9: Create or Replace the update_updated_at_column function (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 10: Create Triggers to auto-update updated_at timestamps
DROP TRIGGER IF EXISTS update_modules_updated_at ON public.modules;
CREATE TRIGGER update_modules_updated_at 
    BEFORE UPDATE ON public.modules
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON public.course_lessons;
CREATE TRIGGER update_course_lessons_updated_at 
    BEFORE UPDATE ON public.course_lessons
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_videos_updated_at ON public.course_videos;
CREATE TRIGGER update_course_videos_updated_at 
    BEFORE UPDATE ON public.course_videos
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_documents_updated_at ON public.course_documents;
CREATE TRIGGER update_course_documents_updated_at 
    BEFORE UPDATE ON public.course_documents
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_resources_updated_at ON public.course_resources;
CREATE TRIGGER update_course_resources_updated_at 
    BEFORE UPDATE ON public.course_resources
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES (Optional - run these to verify)
-- =====================================================

-- Check if all tables were created:
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('modules', 'course_lessons', 'course_videos', 'course_documents', 'course_resources', 'user_course_enrollments', 'user_lesson_progress')
-- ORDER BY table_name;

-- =====================================================
-- DONE! All tables are now created and ready to use.
-- =====================================================






