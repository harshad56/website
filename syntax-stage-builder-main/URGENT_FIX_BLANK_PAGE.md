# 🚨 URGENT: Fix Blank Page - Quick Steps

## The Problem
Blank page at http://192.168.0.102:3000/ is caused by:

1. **Missing or incorrect `.env` files**
2. **Dependencies not installed** 
3. **Network IP configuration wrong**

## ✅ QUICK FIX (5 minutes)

### Step 1: Create/Update .env Files

**Create `syntax-stage-builder-main/.env` file:**

```env
VITE_API_URL=http://192.168.0.102:5000/api
VITE_SOCKET_URL=http://192.168.0.102:5000
VITE_APP_ENV=development
VITE_APP_NAME=CodeAcademy Pro
VITE_APP_VERSION=1.0.0
```

**Create `syntax-stage-builder-main/backend/.env` file:**

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://192.168.0.102:3000
JWT_SECRET=dev-jwt-secret-key-min-32-chars-change-in-production-12345
JWT_EXPIRE=7d
SESSION_SECRET=dev-session-secret-key-min-32-chars-change-in-production-12345
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ENABLE_AI_TUTOR=false
ENABLE_PAYMENTS=false
ENABLE_EMAIL_VERIFICATION=false
ENABLE_OAUTH=false
```

### Step 2: Install Dependencies

```powershell
# Frontend
cd syntax-stage-builder-main
npm install

# Backend
cd backend
npm install
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```powershell
cd syntax-stage-builder-main\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd syntax-stage-builder-main
npm run dev
```

### Step 4: Check Browser Console

1. Open http://192.168.0.102:3000
2. Press **F12** → **Console** tab
3. **Copy any red errors** and share them

## 🔍 Most Common Issues

### Issue 1: "Failed to fetch" or Network Error
**Fix:** Backend not running. Start backend server in Terminal 1.

### Issue 2: "Cannot find module"
**Fix:** Dependencies not installed. Run `npm install` in both folders.

### Issue 3: Still blank page
**Fix:** 
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh (Ctrl + F5)
3. Check browser console for errors (F12)

### Issue 4: API calls failing
**Fix:** Make sure `.env` files use `192.168.0.102` instead of `localhost`

## ⚠️ Important

- **Both servers must run** (backend on 5000, frontend on 3000)
- **Use network IP** (192.168.0.102) in .env files when accessing from other devices
- **Restart servers** after changing .env files

## 🆘 Still Not Working?

1. **Share browser console errors** (F12 → Console)
2. **Share terminal output** from `npm run dev`
3. **Try localhost first**: http://localhost:3000 on the server machine

---

**The blank page is usually a JavaScript error. Check the browser console (F12) to see what's wrong!**


