-- Migration: Add image_url, price, and tags columns to courses table
-- Run this in your Supabase SQL Editor

-- Add image_url column
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add price column
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0;

-- Add tags column as JSONB array
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_price ON public.courses (price);
CREATE INDEX IF NOT EXISTS idx_courses_tags ON public.courses USING GIN (tags);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'courses'
  AND column_name IN ('image_url', 'price', 'tags')
ORDER BY column_name;
