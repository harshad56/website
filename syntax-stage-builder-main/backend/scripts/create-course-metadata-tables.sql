-- Course Metadata Tables for Categories and Languages
-- These tables store custom categories and languages that admins can add

-- Course Categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Languages table
CREATE TABLE IF NOT EXISTS public.course_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.course_categories (name, slug) VALUES
    ('General', 'general'),
    ('Frontend', 'frontend'),
    ('Backend', 'backend'),
    ('Full Stack', 'fullstack'),
    ('Data & AI', 'data'),
    ('DevOps/Cloud', 'devops'),
    ('Mobile', 'mobile'),
    ('Web Development', 'web-development'),
    ('Cloud Computing', 'cloud-computing'),
    ('Theme', 'theme')
ON CONFLICT (slug) DO NOTHING;

-- Insert default languages
INSERT INTO public.course_languages (name, slug) VALUES
    ('Python', 'python'),
    ('JavaScript', 'javascript'),
    ('Java', 'java'),
    ('C#', 'csharp'),
    ('Go', 'go'),
    ('Rust', 'rust'),
    ('TypeScript', 'typescript'),
    ('C++', 'cpp'),
    ('C', 'c'),
    ('PHP', 'php'),
    ('Ruby', 'ruby'),
    ('Swift', 'swift'),
    ('Kotlin', 'kotlin')
ON CONFLICT (slug) DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_categories_slug ON course_categories(slug);
CREATE INDEX IF NOT EXISTS idx_course_categories_active ON course_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_course_languages_slug ON course_languages(slug);
CREATE INDEX IF NOT EXISTS idx_course_languages_active ON course_languages(is_active);

-- Enable RLS
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_languages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active categories and languages
CREATE POLICY "Anyone can view active categories" ON course_categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view active languages" ON course_languages
    FOR SELECT USING (is_active = TRUE);

-- Policy: Admins can manage categories and languages
CREATE POLICY "Admins can manage categories" ON course_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can manage languages" ON course_languages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );




