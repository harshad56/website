# Debug Guide: Course Creation Not Saving to Supabase

## Quick Fix Steps

### Step 1: Check Backend Console
When you try to create a course, check your **backend terminal/console** for error messages. You should see:
- "Creating course with data: ..."
- Any Supabase errors
- Authentication errors

### Step 2: Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Look at the POST request to `/api/courses`
- Console tab: Look for error messages

### Step 3: Verify Authentication
The course creation requires authentication. Check if you have a token:

**In Browser Console:**
```javascript
localStorage.getItem('auth_token')
```

If this returns `null`, you need to log in first.

### Step 4: Test Backend Directly
Test the backend endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Course",
    "language": "python",
    "description": "Test description"
  }'
```

### Step 5: Check Supabase Connection
Verify your backend can connect to Supabase:

**In Backend Console, you should see:**
- "Supabase connection successful" (on server start)
- Or connection errors if there's an issue

## Common Issues & Solutions

### Issue 1: "Access token required"
**Problem**: No authentication token
**Solution**: 
- Log in through the frontend first
- Or the backend will use a dev user in development mode

### Issue 2: "User not found"
**Problem**: Token exists but user not in database
**Solution**: 
- Register/login through backend API first
- Or ensure your Supabase `users` table has the user

### Issue 3: "Database error: column X does not exist"
**Problem**: Missing columns in Supabase
**Solution**: 
- Run the migration: `backend/scripts/add-course-columns.sql`
- Or remove those fields from the request

### Issue 4: "Failed to create course" (generic error)
**Problem**: Backend error not being shown
**Solution**: 
- Check backend logs for detailed error
- The error should now show in the response

### Issue 5: JSON Parse Error
**Problem**: Backend returning non-JSON response
**Solution**: 
- Check if backend server is running
- Check if route exists: `POST /api/courses`
- Check CORS settings

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Supabase credentials are set in backend `.env`
- [ ] `courses` table exists in Supabase
- [ ] User is logged in (or using dev mode)
- [ ] Network request shows correct status code
- [ ] Backend logs show course creation attempt
- [ ] No CORS errors in browser console

## Manual Database Check

After attempting to create a course, check Supabase directly:

1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Open `courses` table
4. Check if new row was created

## Enable Debug Logging

The code now includes detailed logging. Check:

1. **Backend logs** (`backend/logs/combined.log` or console):
   - "Creating course with data: ..."
   - "Supabase createCourse error: ..." (if error)

2. **Browser console**:
   - "API Request: ..."
   - "Creating course with data: ..."
   - "Course creation response: ..."

## Still Not Working?

1. **Check Backend Logs**: Look for the exact error message
2. **Check Network Tab**: See the actual HTTP response
3. **Test Supabase Directly**: Try inserting a course via Supabase SQL editor
4. **Verify Schema**: Ensure `courses` table matches expected schema

## Expected Behavior

When working correctly:
1. Frontend sends POST to `/api/courses`
2. Backend authenticates request (or uses dev user)
3. Backend validates data
4. Backend calls `db.createCourse(courseData)`
5. Supabase inserts row into `courses` table
6. Backend returns success with course data
7. Frontend shows success toast
8. Course appears in the list






