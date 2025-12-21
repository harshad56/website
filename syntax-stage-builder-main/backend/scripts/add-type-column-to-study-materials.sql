-- Add type column to study_materials table
-- This column is required and should be one of: PDF, Notes, Ebook, Video, Document, Tutorial

-- First, add the column as nullable
ALTER TABLE public.study_materials 
ADD COLUMN IF NOT EXISTS type TEXT;

-- Update existing records to have a default type (if any exist without type)
-- You can customize this based on your needs
UPDATE public.study_materials 
SET type = 'Document' 
WHERE type IS NULL;

-- Now make it NOT NULL (this will fail if there are still NULL values)
-- If you want to allow NULL temporarily, comment out this line
ALTER TABLE public.study_materials 
ALTER COLUMN type SET NOT NULL;

-- Optional: Add a check constraint to ensure valid types
-- Uncomment if you want to enforce specific values at database level
-- ALTER TABLE public.study_materials
-- ADD CONSTRAINT study_materials_type_check 
-- CHECK (type IN ('PDF', 'Notes', 'Ebook', 'Video', 'Document', 'Tutorial'));




