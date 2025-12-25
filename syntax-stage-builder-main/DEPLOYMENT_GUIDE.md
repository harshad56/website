# 🚀 CodeAcademy Pro - Deployment & Setup Guide

Complete guide for setting up, running, and deploying the CodeAcademy Pro application.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Frontend Configuration](#frontend-configuration)
4. [Backend Configuration](#backend-configuration)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/bun)
- **MongoDB** 6.0 or higher (for production)
- **Redis** 6.0 or higher (optional, for caching in production)
- **Git** for version control

### Recommended Tools
- **VS Code** with ESLint and Prettier extensions
- **MongoDB Compass** for database management
- **Postman** for API testing
- **Docker & Docker Compose** (for containerized deployment)

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd syntax-stage-builder-main
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This installs all frontend dependencies including React, Vite, Tailwind CSS, and shadcn/ui components.

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Create Environment Files

#### Frontend Environment (.env file in root)

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_ENV=development
VITE_APP_NAME=CodeAcademy Pro
VITE_APP_VERSION=1.0.0
```

#### Backend Environment (backend/.env file)

Create a `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/codeacademy-pro
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Redis Configuration (optional for development)
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Email Service (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# AI Service (OpenAI)
OPENAI_API_KEY=sk-your-openai-api-key

# AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# OAuth (Social Authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Session Configuration
SESSION_SECRET=your-session-secret-key

# Logging
LOG_LEVEL=info
```

---

## Frontend Configuration

### Vite Configuration

The frontend uses **Vite** as the build tool. Key features:

- **Port**: 3000 (configurable in `vite.config.ts`)
- **Hot Module Replacement (HMR)**: Automatic reload on file changes
- **Build Output**: `dist/` directory

### Environment Variables

Frontend environment variables are prefixed with `VITE_`:

```
VITE_API_URL        - Backend API endpoint
VITE_SOCKET_URL     - Socket.IO server URL
VITE_APP_ENV        - Application environment
VITE_APP_NAME       - Application name
VITE_APP_VERSION    - Application version
```

---

## Backend Configuration

### Express Server

The backend runs on **Express.js** with the following structure:

```
backend/
├── config/        # Database and app configuration
├── models/        # Data models (Supabase)
├── routes/        # API endpoints
├── middleware/    # Authentication and validation
├── services/      # Business logic
├── socket/        # Real-time handlers
├── scripts/       # Database migrations and seeds
└── server.js      # Main server file
```

### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/verify` | Verify JWT token |
| GET | `/api/users/:id` | Get user profile |
| POST | `/api/courses` | Get available courses |
| POST | `/api/code/execute` | Execute code |

---

## Running the Application

### Development Environment

#### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Terminal 2: Start Frontend Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

### Production Build

#### Build Frontend

```bash
npm run build
```

Output: `dist/` directory with optimized assets

#### Build Backend

```bash
cd backend
npm run build
npm start
```

---

---

## 🚀 Free Deployment Walkthrough (Render + Vercel + Netlify)

This section guides you through deploying the **Backend to Render** and **Frontend to Vercel OR Netlify** for free.

### Part 1: Database Setup (Supabase)

1. **Create Account**: Go to [Supabase](https://supabase.com/) and sign up.
2. **Create Project**: Create a new project. Give it a name and secure password.
3. **Get API Keys**: 
   - Go to Project Settings -> API.
   - You will need `Project URL` (SUPABASE_URL).
   - You will need `service_role` secret (SUPABASE_SERVICE_ROLE_KEY). **Do not use the anon key on the backend**.

### Part 2: Backend Deployment (Render)

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2. **Create Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/).
   - Click "New +" -> "Web Service".
   - Connect your GitHub repository.
3. **Configure Service**:
   - **Name**: `codeacademy-api` (or similar)
   - **Root Directory**: `backend` (Important! This tells Render the app is in the subfolder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment Variables**:
   - Scroll down to "Environment Variables" and add these:
     - `NODE_ENV`: `production`
     - `SUPABASE_URL`: (Paste your Project URL from Part 1)
     - `SUPABASE_SERVICE_ROLE_KEY`: (Paste your service_role secret from Part 1)
     - `JWT_SECRET`: (Generate a random string)
     - `FRONTEND_URL`: `https://your-frontend-project.vercel.app` (You will update this later after deploying frontend)
5. **Deploy**: Click "Create Web Service".
   - Wait for it to build. Once live, Render will give you a URL like `https://codeacademy-api.onrender.com`.
   - **Copy this URL**.

> [!NOTE] 
> Render Free Tier spins down after 15 minutes of inactivity. The first request might take 30-60 seconds.

### Part 3 Option A: Frontend Deployment (Vercel) - Recommended

1. **Import Project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - "Add New" -> "Project".
   - Import your same GitHub repository.
2. **Configure Project**:
   - **Framework Preset**: Vite (should detect automatically).
   - **Root Directory**: Click "Edit" and select `.` (root) or leave as default if it detects the root properly.
3. **Environment Variables**:
   - Expand the "Environment Variables" section.
   - Add:
     - `VITE_API_URL`: `https://codeacademy-api.onrender.com/api` (Use your Render Backend URL + `/api`)
     - `VITE_SOCKET_URL`: `https://codeacademy-api.onrender.com` (Your Render Backend URL)
4. **Deploy**: Click "Deploy".
5. **Final Step**:
   - Once deployed, Vercel gives you a domain (e.g., `https://codeacademy-project.vercel.app`).
   - Go back to **Render Dashboard** -> Your Web Service -> Environment Variables.
   - Update `FRONTEND_URL` to your new Vercel domain.
   - **Save Changes** in Render (this will restart the backend).

### Part 3 Option B: Frontend Deployment (Netlify)

> [!IMPORTANT]
> **Fix for 404 Errors**: I have added a `netlify.toml` file to your project. This fixes the "Page Not Found" error by correctly handling client-side routing.

1. **Import Project**:
   - Go to [Netlify Dashboard](https://app.netlify.com/).
   - "Add new site" -> "Import an existing project".
   - Connect GitHub and select your repository.
2. **Configure Build**:
   - **Base directory**: (Leave empty or `/`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. **Environment Variables**:
   - Click "Show advanced" -> "New Variable".
   - Add:
     - Key: `VITE_API_URL`, Value: `https://codeacademy-api.onrender.com/api`
     - Key: `VITE_SOCKET_URL`, Value: `https://codeacademy-api.onrender.com`
4. **Deploy**: Click "Deploy site".

🎉 **You are live!**

---

## Production Deployment

### 1. Backend Deployment (Render)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. **Build Command**: `cd backend && npm install`
4. **Start Command**: `cd backend && node server.js`
5. **Environment Variables**:
   Add the following variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `SUPABASE_URL`: `your_supabase_project_url`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your_supabase_service_role_key`
   - `JWT_SECRET`: `your_jwt_secret_key`
   - `GOOGLE_CLIENT_ID`: `your_google_client_id`
   - `GOOGLE_CLIENT_SECRET`: `your_google_client_secret`
   - `GITHUB_CLIENT_ID`: `your_github_client_id`
   - `GITHUB_CLIENT_SECRET`: `your_github_client_secret`
   - `FRONTEND_URL`: `https://your-vercel-app.vercel.app` (Your Vercel Frontend URL)
   - `BACKEND_URL`: `https://your-render-app.onrender.com` (Your Render Backend URL - **CRITICAL**)
   - `REDIS_URL`: `your_redis_url` (Optional)
   - `STRIPE_SECRET_KEY`: `your_stripe_key` (Optional)

   > **Note**: `BACKEND_URL` must not have a trailing slash.

### 2. Frontend Deployment (Vercel)

1. Import your GitHub repository in Vercel.
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**:
   Add the following variables in the Vercel dashboard settings:
   - `VITE_API_URL`: `https://your-render-app.onrender.com/api` (**CRITICAL**: Must point to your Render backend + /api)
   - `VITE_SOCKET_URL`: `https://your-render-app.onrender.com` (Must point to your Render backend root)

   > **Important**: After adding these variables, you must **Redeploy** for them to take effect.

---

## Docker Deployment

### Build Docker Image

```bash
docker build -t codeacademy-pro:latest .
```

### Run Docker Container

```bash
docker run -p 3000:3000 -p 5000:5000 \
  -e SUPABASE_URL=your_supabase_url \
  -e SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key \
  -e NODE_ENV=production \
  codeacademy-pro:latest
```

### Docker Compose (Recommended)

```bash
docker-compose up -d
```

This starts:
- Frontend (port 3000)
- Backend (port 5000)
- MongoDB (port 27017)
- Redis (port 6379)

---

## Troubleshooting

### Issue: Port Already in Use

**Frontend (3000)**:
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Backend (5000)**:
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: Cannot Connect to Backend

1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`
3. Check CORS configuration in `backend/server.js`
4. Verify `FRONTEND_URL` in backend `.env`

### Issue: Database Connection Failed

1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
2. Check if your IP is allowed in Supabase settings (if restriction is enabled)
3. Verify database tables exist (Supabase project is set up correctly)
4. Check network connectivity

### Issue: GitHub/Google Sign-in "Redirect URI Mismatch"
**Error**: "The redirect_uri is not associated with this application."

**Solution**:
1.  **Google**: Go to Google Cloud Console -> Credentials.
    *   Add URI: `https://your-render-app.onrender.com/api/auth/google/callback`
2.  **GitHub**: Go to GitHub Developer Settings -> OAuth Apps -> Select your App.
    *   Update **Authorization callback URL** to:
    *   `https://your-render-app.onrender.com/api/auth/github/callback`
    *   (Make sure there are no trailing slashes or spaces).

### Issue: Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Try building again
npm run build
```

### Issue: Netlify Build Failed (package.json not found)
**Error**: `npm error enoent Could not read package.json`

**Cause**: Your project files are likely inside a subdirectory in your GitHub repository (e.g., `repo-name/project-folder/package.json`) instead of the root.

**Solution**:
1. Go to Netlify Dashboard -> Site Settings -> Build & Deploy.
2. Click "Edit settings".
3. Set **Base directory** to your project folder name (e.g., `syntax-stage-builder-main`).
4. Set **Publish directory** to `syntax-stage-builder-main/dist` (or just `dist` if it auto-detects).
5. Click "Save" and "Trigger deploy".

### Issue: ESLint Errors

```bash
# Fix linting issues automatically
npm run lint -- --fix
```

---

## 🔄 How to Update Your Website

Since you have connected your GitHub repository to both Render and Vercel, updating your site is automatic!

### 1. Make Changes Locally
Edit your code, clean up bugs, or add new features on your computer.

### 2. Commit and Push
Open your terminal or VS Code Source Control and run:

```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

### 3. Automatic Deployment
- **Render (Backend)**: Will detect the push, pull the new code, and redeploy automatically. (Takes ~2-3 minutes)
- **Vercel (Frontend)**: Will detect the push, build the new assets, and publish automatically. (Takes ~1 minute)

> **Note**: If you add **new environment variables** (e.g., a new API key), you must manually add them to the Render or Vercel dashboard *before* or *immediately after* pushing.

---

## Performance Optimization

### Frontend

- Enable Gzip compression
- Minimize bundle size with tree-shaking
- Use lazy loading for routes
- Optimize images with proper formats
- Cache static assets

### Backend

- Enable Redis caching
- Use database indexing
- Implement pagination for large datasets
- Enable compression middleware
- Use CDN for static files

---

## Security Checklist

- [ ] All secrets in `.env` (never in code)
- [ ] HTTPS enabled in production
- [ ] JWT tokens have expiration
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Regular security audits

---

## Monitoring & Logging

### Frontend Logs

Access browser console: `F12` → Console tab

### Backend Logs

Check Winston logs in `backend/logs/` directory

### Application Monitoring

Integrate with:
- Sentry (error tracking)
- New Relic (performance monitoring)
- DataDog (infrastructure monitoring)

---

## Support & Resources

- **Documentation**: See `README.md`
- **API Documentation**: `backend/README.md`
- **Issues**: Create GitHub issue
- **Contact**: harsh@example.com

---

**Last Updated**: November 2025
**Version**: 1.0.0
