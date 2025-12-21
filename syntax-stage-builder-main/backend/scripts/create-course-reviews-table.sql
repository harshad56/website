-- Course Reviews and Ratings table
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, user_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_user ON course_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_rating ON course_reviews(course_id, rating);

-- Enable RLS
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all reviews
CREATE POLICY "Anyone can view reviews" ON course_reviews
    FOR SELECT USING (true);

-- Policy: Users can create their own reviews
CREATE POLICY "Users can create reviews" ON course_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON course_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON course_reviews
    FOR DELETE USING (auth.uid() = user_id);




