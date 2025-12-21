# Quick Setup Script for Windows
# Run this script to set up your environment files

Write-Host "🚀 Setting up CodeAcademy Pro..." -ForegroundColor Green

# Check if .env files exist
$frontendEnv = ".env"
$backendEnv = "backend\.env"

# Create frontend .env if it doesn't exist
if (-not (Test-Path $frontendEnv)) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    @"
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_ENV=development
VITE_APP_NAME=CodeAcademy Pro
VITE_APP_VERSION=1.0.0
"@ | Out-File -FilePath $frontendEnv -Encoding utf8
    Write-Host "✅ Frontend .env created!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend .env already exists, skipping..." -ForegroundColor Yellow
}

# Create backend .env if it doesn't exist
if (-not (Test-Path $backendEnv)) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    
    # Generate random secrets
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    $sessionSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    @"
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=$sessionSecret

# Supabase Configuration (Optional for development)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Feature Flags
ENABLE_AI_TUTOR=false
ENABLE_PAYMENTS=false
ENABLE_EMAIL_VERIFICATION=false
ENABLE_OAUTH=false
"@ | Out-File -FilePath $backendEnv -Encoding utf8
    Write-Host "✅ Backend .env created with random secrets!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env already exists, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Install dependencies: npm install (in root) and npm install (in backend)" -ForegroundColor White
Write-Host "2. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Start frontend: npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""


