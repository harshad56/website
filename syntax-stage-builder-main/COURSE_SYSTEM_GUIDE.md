# Complete Course System Guide

## Overview
This guide explains the complete course system with enrollment, content management, and student learning interface - similar to Udemy.

## Features Implemented

### 1. Currency Change (₹ INR)
- ✅ All prices now display in Indian Rupees (₹) instead of dollars ($)
- ✅ Updated in CourseCatalog, AdminCourses, and CourseDetail pages

### 2. Course Detail Page
- ✅ Route: `/course/:courseId`
- ✅ Shows course information, pricing, and enrollment button
- ✅ Displays course content structure (modules and lessons)
- ✅ Shows enrollment status

### 3. Enrollment System
- ✅ Users can enroll in courses (free or paid)
- ✅ Enrollment status is tracked in `user_course_enrollments` table
- ✅ Progress tracking per lesson

### 4. Course Content Structure
- ✅ **Modules**: Organize lessons into sections
- ✅ **Lessons**: Individual learning units (video, document, quiz, assignment)
- ✅ **Videos**: YouTube, Vimeo, or direct video URLs
- ✅ **Documents**: PDFs, DOCX, or links
- ✅ **Resources**: Additional files and templates

### 5. Admin Content Management
- ✅ Route: `/admin/courses/:courseId/content`
- ✅ Create modules for courses
- ✅ Add lessons to modules
- ✅ Add videos to lessons (YouTube, Vimeo, or direct)
- ✅ Add documents to lessons
- ✅ Organize content with order indices

### 6. Student Learning Interface
- ✅ Route: `/learn/:courseId`
- ✅ Sidebar with course content structure
- ✅ Video player for video lessons
- ✅ Document viewer/downloader
- ✅ Progress tracking
- ✅ Mark lessons as complete
- ✅ Navigate between lessons

## Database Schema

### Required Tables (Run SQL in Supabase)

1. **course_lessons** - Individual lessons
2. **course_videos** - Video content for lessons
3. **course_documents** - Document content for lessons
4. **course_resources** - Additional resources
5. **user_course_enrollments** - User enrollments
6. **user_lesson_progress** - Lesson completion tracking

**SQL Script**: `backend/scripts/course-content-schema.sql`

Run this in your Supabase SQL Editor to create all required tables.

## How to Use

### For Admins

1. **Create a Course**
   - Go to `/admin/courses`
   - Click "Add Course"
   - Fill in course details (title, description, language, price, etc.)
   - Save

2. **Add Course Content**
   - Click "Manage Content" on any course
   - Create modules (e.g., "Introduction", "Advanced Topics")
   - Add lessons to each module
   - For each lesson:
     - **Video Lesson**: Add YouTube/Vimeo video or direct video URL
     - **Document Lesson**: Add PDF/DOCX document URL
   - Organize with order indices

3. **Example Structure**
   ```
   Course: Python Basics
   ├── Module 1: Introduction
   │   ├── Lesson 1: What is Python? (Video)
   │   └── Lesson 2: Setup Guide (Document)
   ├── Module 2: Variables
   │   ├── Lesson 1: Variables Explained (Video)
   │   └── Lesson 2: Practice Exercises (Document)
   ```

### For Students

1. **Browse Courses**
   - Go to `/courses`
   - Browse available courses
   - Click on a course to see details

2. **Enroll in Course**
   - Click "Enroll Now" on course detail page
   - Free courses enroll immediately
   - Paid courses require payment (to be implemented)

3. **Learn**
   - After enrollment, go to `/learn/:courseId`
   - Navigate through modules and lessons
   - Watch videos or read documents
   - Mark lessons as complete
   - Track your progress

## API Endpoints

### Course Enrollment
- `POST /api/courses/:id/enroll` - Enroll in a course
- `GET /api/courses/:id/enrollment` - Check enrollment status
- `GET /api/courses/:id/content` - Get full course content (enrolled users only)

### Course Content Management (Admin)
- `POST /api/courses/:courseId/modules` - Create module
- `POST /api/modules/:moduleId/lessons` - Create lesson
- `POST /api/lessons/:lessonId/videos` - Add video
- `POST /api/lessons/:lessonId/documents` - Add document

### Progress Tracking
- `POST /api/lessons/:lessonId/complete` - Mark lesson as complete

## Video Integration

### YouTube Videos
1. Get video ID from YouTube URL: `youtube.com/watch?v=VIDEO_ID`
2. Select "YouTube" as provider
3. Enter the video ID
4. Video will embed automatically

### Vimeo Videos
1. Get video ID from Vimeo URL
2. Select "Vimeo" as provider
3. Enter the video ID

### Direct Video URLs
1. Upload video to hosting service
2. Select "Direct URL" as provider
3. Paste the video URL

## Document Integration

### PDF/DOCX Documents
1. Upload document to file hosting service:
   - Google Drive (make shareable)
   - Dropbox
   - AWS S3
   - Any file hosting service
2. Get the direct download URL
3. Paste URL in document form
4. Select document type (PDF, DOCX, etc.)

## Current Status

✅ **Completed:**
- Currency change to ₹
- Course detail page
- Enrollment system
- Database schema
- Admin content management interface
- Student learning interface
- Progress tracking

⚠️ **To Do:**
- Payment integration for paid courses
- Quiz/Assignment functionality
- Certificate generation
- Course reviews and ratings
- Discussion forums per course

## Troubleshooting

### "Tables don't exist" error
- Run the SQL script: `backend/scripts/course-content-schema.sql`
- Make sure all tables are created in Supabase

### "You must enroll first" error
- User needs to enroll in course before accessing content
- Go to course detail page and click "Enroll Now"

### Videos not loading
- Check video URL/ID is correct
- For YouTube, ensure video is not private
- For direct URLs, ensure CORS is enabled

### Documents not accessible
- Check document URL is publicly accessible
- Ensure URL is a direct download link (not a page with the file)

## Next Steps

1. **Run Database Migration**
   ```sql
   -- Run backend/scripts/course-content-schema.sql in Supabase
   ```

2. **Test the System**
   - Create a test course
   - Add modules and lessons
   - Enroll as a student
   - Access course content

3. **Add Real Content**
   - Upload your course videos
   - Prepare course documents
   - Structure your course content

Enjoy your Udemy-like course system! 🎓






