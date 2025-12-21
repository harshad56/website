-- Migration: Change image_url column to TEXT to support longer URLs
-- Run this in your Supabase SQL Editor if you want to support longer image URLs

-- Change image_url from VARCHAR(500) to TEXT to support longer URLs
ALTER TABLE public.courses 
ALTER COLUMN image_url TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'courses'
  AND column_name = 'image_url';






