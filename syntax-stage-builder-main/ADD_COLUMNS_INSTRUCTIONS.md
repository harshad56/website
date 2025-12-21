# Add Remaining Columns to Courses Table

## Step 1: Run SQL Migration in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the following SQL:

```sql
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
```

4. Click **Run** to execute the migration

## Step 2: Verify Columns Were Added

Run this query to verify:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'courses'
  AND column_name IN ('image_url', 'price', 'tags')
ORDER BY column_name;
```

You should see:
- `image_url` (character varying)
- `price` (numeric/decimal)
- `tags` (jsonb)

## Step 3: Restart Backend (Optional)

The code is already updated to handle these fields. You may want to restart your backend:

```bash
cd backend
npm run dev
```

## Step 4: Test Course Creation

1. Go to `http://localhost:3000/admin/courses`
2. Click "Add Course"
3. Fill in all fields including:
   - **Thumbnail image URL** (image_url)
   - **Price** (price)
   - **Tags** (tags - comma separated)
4. Click "Save course"

All fields should now be saved to the database! ✅

## What Was Updated

### Backend Code
- ✅ `backend/routes/courses.js` - Now includes image_url, price, and tags
- ✅ `backend/config/supabase.js` - Added these fields to allowedFields array
- ✅ Field validation and formatting included

### Database Schema
After running the migration, your `courses` table will have:
- ✅ `image_url VARCHAR(500)` - For course thumbnail images
- ✅ `price DECIMAL(10, 2)` - Course price (defaults to 0)
- ✅ `tags JSONB` - Array of tags (defaults to empty array)

## Notes

- The code will automatically filter out these fields if the columns don't exist (graceful degradation)
- After adding the columns, all form fields will work automatically
- Tags can be entered as comma-separated values (e.g., "Python, Backend, Beginner")
- Price defaults to 0 if not provided
- Image URL is optional






