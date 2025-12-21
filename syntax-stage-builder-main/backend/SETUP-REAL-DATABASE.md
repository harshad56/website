# 🗄️ Setting Up Real Database Connection

## 🎯 **Goal**
Replace mock data with real database storage for users, courses, and all application data.

## 📋 **Prerequisites**
1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18+ (already installed)
3. **Project Dependencies**: Already installed

## 🚀 **Step-by-Step Setup**

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub, Google, or email
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `syntax-stage-builder` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait for project setup (2-3 minutes)

### 2. **Get Your API Keys**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

### 3. **Create Environment File**
1. In the `backend/` folder, create a file named `.env`
2. Copy this template and fill in your values:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080

# Supabase Configuration - FILL IN YOUR VALUES
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Development Configuration
DEBUG=true
HOT_RELOAD=true
SEED_DATABASE=false
```

### 4. **Start Real Database Server**
```bash
# Stop the mock server first
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Start the real database server
npm run dev:real
```

## 🗃️ **Database Tables**
The application expects these tables in Supabase:

### **Core Tables:**
- `users` - User accounts and profiles
- `courses` - Learning courses
- `modules` - Course modules
- `topics` - Learning topics
- `user_progress` - User learning progress
- `posts` - Community posts
- `code_executions` - Code execution history
- `ai_conversations` - AI tutor conversations

### **Optional Tables:**
- `study_groups` - Study group management
- `mentorship_sessions` - Mentorship scheduling
- `analytics_events` - User analytics
- `payments` - Payment records

## 🔧 **Database Schema Setup**

### **Option 1: Use Supabase Dashboard**
1. Go to **Table Editor** in Supabase
2. Create tables manually using the SQL editor
3. Run the SQL commands from the schema files

### **Option 2: Use Migration Scripts**
```bash
# Run database migrations
npm run migrate

# Seed with sample data (optional)
npm run seed
```

## ✅ **Verification**

### **Test Database Connection:**
1. Start the server: `npm run dev:real`
2. Check health endpoint: `http://localhost:5000/health`
3. Should show: `"database": "Connected to Supabase"`

### **Test User Registration:**
1. Go to frontend: `http://localhost:8080`
2. Try to register a new user
3. Check Supabase dashboard → **Table Editor** → `users` table
4. Should see the new user record

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **"Missing Supabase configuration"**
- Check your `.env` file exists
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Restart the server after creating `.env`

#### **"Failed to connect to Supabase"**
- Verify your API keys are correct
- Check if your Supabase project is active
- Ensure your IP is not blocked

#### **"Table does not exist"**
- Create the required database tables
- Use the migration scripts or create manually
- Check table names match exactly

### **Get Help:**
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Check server logs for detailed error messages
- Verify environment variables are loaded correctly

## 🎉 **Success Indicators**
- ✅ Server starts without errors
- ✅ Health endpoint shows "Connected to Supabase"
- ✅ User registration creates records in database
- ✅ Login/authentication works
- ✅ Data persists between server restarts

## 🔄 **Switching Between Modes**
- **Mock Mode**: `npm run dev:minimal` (no database required)
- **Real Database**: `npm run dev:real` (requires Supabase setup)
- **Production**: `npm start` (uses `server.js`)

---

**Happy coding with real data!** 🚀 