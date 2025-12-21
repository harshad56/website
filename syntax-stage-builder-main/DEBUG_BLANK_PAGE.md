# 🔍 Debugging Blank Page Issue

If you're seeing a blank page at http://192.168.0.102:3000/, follow these steps:

## Step 1: Check Browser Console

1. Open your browser (on the device accessing http://192.168.0.102:3000/)
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for any **red error messages**
5. **Copy and share** any errors you see

Common errors you might see:
- `Failed to fetch` - Backend not running or CORS issue
- `Cannot find module` - Missing dependencies
- `Uncaught TypeError` - JavaScript error
- `404` errors for assets - Build issue

## Step 2: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page (F5)
3. Look for files with **red status codes** (404, 500, etc.)
4. Check if `main.tsx` or other JS files are loading

## Step 3: Verify Server is Running

On the computer running the dev server, check:

```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000
```

You should see the Vite dev server running.

## Step 4: Check for JavaScript Errors

The blank page is usually caused by:
1. **JavaScript error** preventing React from rendering
2. **Missing dependencies** not installed
3. **Build/compilation error** in the code

## Quick Fixes to Try

### Fix 1: Reinstall Dependencies

```powershell
cd syntax-stage-builder-main
rm -rf node_modules package-lock.json
npm install
```

### Fix 2: Clear Browser Cache

1. Press **Ctrl + Shift + Delete**
2. Clear cached images and files
3. Refresh the page with **Ctrl + F5**

### Fix 3: Check Environment Variables

Make sure `.env` file exists in `syntax-stage-builder-main/` folder:

```env
VITE_API_URL=http://192.168.0.102:5000/api
VITE_SOCKET_URL=http://192.168.0.102:5000
VITE_APP_ENV=development
VITE_APP_NAME=CodeAcademy Pro
VITE_APP_VERSION=1.0.0
```

**Note:** If accessing from network IP (192.168.0.102), update the API URLs to use the same IP!

### Fix 4: Restart Dev Server

1. Stop the dev server (Ctrl + C)
2. Start it again:
   ```powershell
   npm run dev
   ```
3. Make sure it shows: `Local: http://localhost:3000/` and `Network: http://192.168.0.102:3000/`

### Fix 5: Check Backend is Running

The frontend needs the backend to be running. Make sure:

```powershell
cd backend
npm run dev
```

Backend should be running on port 5000.

## Most Common Issue: Network IP Configuration

If you're accessing from **192.168.0.102:3000**, you need to:

1. **Update frontend .env** to use the network IP:
   ```env
   VITE_API_URL=http://192.168.0.102:5000/api
   VITE_SOCKET_URL=http://192.168.0.102:5000
   ```

2. **Update backend .env** to allow the network IP:
   ```env
   FRONTEND_URL=http://192.168.0.102:3000
   ```

3. **Restart both servers** after changing .env files

## Still Not Working?

1. **Share the browser console errors** (F12 → Console tab)
2. **Share the terminal output** from `npm run dev`
3. **Check if localhost works**: Try http://localhost:3000 on the server machine

---

**The most likely issue is that the API URLs in .env are pointing to localhost instead of the network IP!**


