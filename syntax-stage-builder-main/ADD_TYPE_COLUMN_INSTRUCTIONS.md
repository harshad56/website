# Instructions: Add Type Column to study_materials Table

## Problem
The `study_materials` table in your Supabase database is missing the `type` column, which is required for the study materials feature to work properly.

## Solution

### Step 1: Run SQL Migration in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
-- Add type column to study_materials table
-- This column is required and should be one of: PDF, Notes, Ebook, Video, Document, Tutorial

-- First, add the column as nullable
ALTER TABLE public.study_materials 
ADD COLUMN IF NOT EXISTS type TEXT;

-- Update existing records to have a default type (if any exist without type)
UPDATE public.study_materials 
SET type = 'Document' 
WHERE type IS NULL;

-- Now make it NOT NULL (this will fail if there are still NULL values)
ALTER TABLE public.study_materials 
ALTER COLUMN type SET NOT NULL;
```

6. Click **Run** to execute the query
7. Verify the column was added by checking the Table Editor

### Step 2: Verify the Changes

After running the SQL:
1. Go to **Table Editor** → `study_materials` table
2. You should now see a `type` column
3. All existing records should have `type = 'Document'` (you can update them manually if needed)

## What Was Changed in the Code

### ✅ Frontend (`src/pages/AdminStudyMaterials.tsx`)
- Type field is now **required** (marked with red asterisk *)
- Placeholder changed from "Select type (optional)" to "Select type (required)"
- Validation added: Type must be selected before saving
- Auto-detection: When you upload a PDF file or enter a URL ending in `.pdf`, type automatically sets to "PDF"

### ✅ Backend (`backend/config/supabase.js`)
- Validation added: Type is required when creating/updating study materials
- Error message: "Type is required and cannot be empty. Must be one of: PDF, Notes, Ebook, Video, Document, Tutorial"

### ✅ SQL Schema (`backend/scripts/create-study-materials-table.sql`)
- Updated to show `type text not null` (required field)

### ✅ Migration Script (`backend/scripts/add-type-column-to-study-materials.sql`)
- Created SQL migration file for adding the column

## Type Options

The following types are available:
- **PDF** - For PDF documents
- **Notes** - For text/markdown notes
- **Ebook** - For ebook files (epub, mobi, etc.)
- **Video** - For video files
- **Document** - For Word documents and other files
- **Tutorial** - For tutorial materials

## Auto-Detection Feature

When you:
- **Upload a PDF file** → Type automatically sets to "PDF"
- **Enter a URL ending in `.pdf`** → Type automatically sets to "PDF"
- **Upload other file types** → Type automatically detects (Video, Ebook, Notes, Document)

You can still manually change the type if needed.

## Next Steps

1. ✅ Run the SQL migration in Supabase (Step 1 above)
2. ✅ Test creating a new study material - Type field should be required
3. ✅ Test uploading a PDF - Type should auto-set to "PDF"
4. ✅ Update existing study materials to have the correct type

---

**Note:** If you have existing study materials in the database, they will be set to type "Document" by default. You can manually update them to the correct type through the admin panel.




