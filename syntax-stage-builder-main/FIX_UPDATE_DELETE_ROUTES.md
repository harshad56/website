# Fix: Update and Delete Routes Not Working

## Problem
Getting 404 "Route not found" when trying to update or delete courses.

## Solution
The routes are correctly defined, but the backend server needs to be **restarted** to load the new routes.

## Steps to Fix

### 1. Stop the Backend Server
If your backend is running, stop it:
- Press `Ctrl+C` in the terminal where the backend is running
- Or close the terminal

### 2. Restart the Backend Server
```bash
cd backend
npm run dev
```

### 3. Verify Routes Are Loaded
After restarting, you should see the server start successfully. The routes should now work:
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

## Routes That Should Work

After restart, these endpoints will be available:

1. **GET** `/api/courses` - List all courses ✅
2. **POST** `/api/courses` - Create course ✅
3. **GET** `/api/courses/:id` - Get course by ID ✅
4. **PUT** `/api/courses/:id` - Update course ✅ (NEW)
5. **DELETE** `/api/courses/:id` - Delete course ✅ (NEW)

## Test After Restart

1. Go to `http://localhost:3000/admin/courses`
2. Hover over a course card
3. Click **Edit** button - should open edit dialog
4. Make changes and click **Update Course** - should work now
5. Click **Delete** button - should show confirmation and delete

## If Still Not Working

If you still get 404 after restarting:

1. **Check Backend Console**: Look for any errors when starting
2. **Verify Route Registration**: Check that you see no errors in the backend logs
3. **Check Port**: Make sure backend is running on port 5000
4. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R)

## Route Definitions

The routes are defined in `backend/routes/courses.js`:
- Lines 161-256: PUT route for updating
- Lines 258-308: DELETE route for deleting

Both routes include:
- Development mode authentication bypass
- Admin permission checks
- Proper error handling






