# 🚨 Fix Blank Page Issue - Step by Step

## The Problem
You're seeing a blank page because:
1. ❌ **Missing `.env` file** - Environment variables not configured
2. ❌ **Dependencies not installed** - `node_modules` missing
3. ❌ **Network IP configuration** - API URLs pointing to localhost instead of network IP

## ✅ Solution - Follow These Steps

### Step 1: Install Dependencies

Open PowerShell in the project folder and run:

```powershell
# Install frontend dependencies
cd syntax-stage-builder-main
npm install

# Install backend dependencies  
cd backend
npm install
cd ..
```

**Wait for installation to complete!** This may take 2-5 minutes.

### Step 2: Verify .env Files Were Created

I've created the `.env` files for you. Verify they exist:

```powershell
# Check frontend .env
Test-Path "syntax-stage-builder-main\.env"

# Check backend .env
Test-Path "syntax-stage-builder-main\backend\.env"
```

Both should return `True`.

### Step 3: Start Backend Server

Open **Terminal 1** (PowerShell):

```powershell
cd syntax-stage-builder-main\backend
npm run dev
```

**Wait for:** `🚀 CodeAcademy Pro Backend running on port 5000`

### Step 4: Start Frontend Server

Open **Terminal 2** (PowerShell):

```powershell
cd syntax-stage-builder-main
npm run dev
```

**Wait for:** 
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network:  http://192.168.0.102:3000/
```

### Step 5: Access the Website

**On the same computer:**
- Open: http://localhost:3000

**From another device on the network:**
- Open: http://192.168.0.102:3000

## 🔧 If Still Blank Page

### Check Browser Console (F12)

1. Press **F12** in your browser
2. Go to **Console** tab
3. Look for **red errors**
4. Common errors:

**Error: "Failed to fetch" or "Network error"**
- Backend not running
- Check Terminal 1 - backend should be running

**Error: "Cannot find module"**
- Dependencies not installed
- Run `npm install` again

**Error: "Uncaught TypeError"**
- JavaScript error in code
- Share the error message

### Clear Browser Cache

1. Press **Ctrl + Shift + Delete**
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh with **Ctrl + F5**

### Verify Network Access

The Vite config is set to allow network access. When you run `npm run dev`, you should see:
```
Network:  http://192.168.0.102:3000/
```

If you don't see the Network line, the server might not be accessible from other devices.

## 📝 Important Notes

1. **Both servers must be running:**
   - Backend on port 5000
   - Frontend on port 3000

2. **Environment variables use network IP:**
   - `VITE_API_URL=http://192.168.0.102:5000/api`
   - This allows access from other devices on your network

3. **If you change the network IP:**
   - Update `.env` files with the new IP
   - Restart both servers

## 🆘 Still Not Working?

Share these details:
1. **Browser console errors** (F12 → Console)
2. **Terminal output** from `npm run dev`
3. **Backend terminal output** from `npm run dev` in backend folder
4. **Does localhost work?** Try http://localhost:3000 on the server machine

---

**Most common fix:** Make sure dependencies are installed with `npm install` in both frontend and backend folders!


