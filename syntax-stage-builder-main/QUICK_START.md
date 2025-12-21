# 🚀 Quick Start Guide - Deploy Your Website Fast

This guide will help you get your website running quickly.

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd syntax-stage-builder-main
npm install
```

**Terminal 2 - Backend:**
```bash
cd syntax-stage-builder-main/backend
npm install
```

### Step 2: Create Environment Files

**Create `.env` file in `syntax-stage-builder-main/` folder:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_ENV=development
VITE_APP_NAME=CodeAcademy Pro
VITE_APP_VERSION=1.0.0
```

**Create `.env` file in `syntax-stage-builder-main/backend/` folder:**
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT Configuration (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d

# Session Configuration (generate a random 32+ character string)
SESSION_SECRET=your-session-secret-key-change-this-in-production-min-32-chars

# Supabase (Optional for development - add later for full features)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Feature Flags (disable features that need external services)
ENABLE_AI_TUTOR=false
ENABLE_PAYMENTS=false
ENABLE_EMAIL_VERIFICATION=false
ENABLE_OAUTH=false
```

### Step 3: Start the Servers

**Terminal 1 - Backend:**
```bash
cd syntax-stage-builder-main/backend
npm run dev
```

Wait for: `🚀 CodeAcademy Pro Backend running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd syntax-stage-builder-main
npm run dev
```

Wait for: `Local: http://localhost:3000`

### Step 4: Open Your Browser

Visit: **http://localhost:3000**

## ✅ What's Fixed

1. ✅ **Environment Variables** - Created template .env files
2. ✅ **API Configuration** - Fixed VITE_API_URL usage
3. ✅ **Port Configuration** - Frontend now runs on port 3000
4. ✅ **Supabase** - Made optional for development (won't crash if not configured)
5. ✅ **CORS** - Fixed to allow frontend-backend communication

## 🐛 Troubleshooting

### Port Already in Use

**Windows:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000
# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F

# Find process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Backend Won't Start

- Check if port 5000 is available
- Make sure `.env` file exists in `backend/` folder
- Check console for error messages

### Frontend Can't Connect to Backend

- Make sure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env` file
- Check browser console for CORS errors

### Missing Dependencies

```bash
# Frontend
cd syntax-stage-builder-main
rm -rf node_modules package-lock.json
npm install

# Backend
cd syntax-stage-builder-main/backend
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Deployment

### Build for Production

**Frontend:**
```bash
cd syntax-stage-builder-main
npm run build
```

Output will be in `dist/` folder - deploy this to any static hosting (Vercel, Netlify, etc.)

**Backend:**
```bash
cd syntax-stage-builder-main/backend
npm start
```

### Required Production Environment Variables

For production, you MUST set:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (get from https://supabase.com)
- Strong `JWT_SECRET` and `SESSION_SECRET` (32+ random characters)
- `NODE_ENV=production`
- `FRONTEND_URL` (your production frontend URL)

## 📝 Next Steps

1. **Set up Supabase** (optional but recommended):
   - Go to https://supabase.com
   - Create a free project
   - Copy your URL and keys to backend `.env`
   - Run the SQL schema from `backend/scripts/supabase-schema.sql`

2. **Configure Features**:
   - Enable AI Tutor: Set `OPENAI_API_KEY` and `ENABLE_AI_TUTOR=true`
   - Enable Payments: Set Stripe keys and `ENABLE_PAYMENTS=true`
   - Enable Email: Set email credentials and `ENABLE_EMAIL_VERIFICATION=true`

3. **Deploy**:
   - Frontend: Deploy `dist/` folder to Vercel/Netlify
   - Backend: Deploy to Railway/Render/Heroku

## 🆘 Still Having Issues?

1. Check the console logs in both terminals
2. Check browser console (F12) for errors
3. Verify all `.env` files are created correctly
4. Make sure Node.js version is 18+ (`node --version`)

---

**You're all set! Your website should now be running.** 🎉


