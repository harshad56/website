const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://sozycfpmxirbwmlwkzdp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvenljZnBteGlyYndtbHdremRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDUyMTQsImV4cCI6MjA2OTk4MTIxNH0.d2oeBtG0J83n6svyHU5pY-iKiPcdZ3GI5L2uOpMArB4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvenljZnBteGlyYndtbHdremRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwNTIxNCwiZXhwIjoyMDY5OTgxMjE0fQ.tjkAlmnaC8Dx53suYVsbHGus9rgbG-Skf3ET5kkP-Mk

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@codeacademy-pro.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# AWS Configuration (for file storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=codeacademy-pro-files

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Analytics Configuration
ANALYTICS_ENABLED=true
MIXPANEL_TOKEN=your-mixpanel-token
GOOGLE_ANALYTICS_ID=your-ga-id

# Security Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE_PATH=logs/

# Feature Flags
ENABLE_AI_TUTOR=true
ENABLE_REAL_TIME_COLLABORATION=true
ENABLE_PAYMENTS=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_OAUTH=true

# Performance Configuration
CACHE_TTL=3600
MAX_FILE_SIZE=10485760
COMPRESSION_ENABLED=true

# Development Configuration
DEBUG=true
HOT_RELOAD=true
SEED_DATABASE=false
`;

const envPath = path.join(__dirname, '.env');

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully with your service role key!');
    console.log('🚀 Ready to start the server!');
} catch (error) {
    console.error('❌ Failed to update .env file:', error.message);
}