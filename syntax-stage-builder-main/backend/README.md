# 🚀 CodeAcademy Pro Backend with Supabase

A production-ready backend server for the CodeAcademy Pro learning platform, powered by Supabase for database, authentication, and real-time features.

## 🎯 **Features**

### ✅ **Complete Backend Infrastructure**
- **Express.js Server** with comprehensive middleware
- **Supabase PostgreSQL Database** with real-time subscriptions
- **Redis Caching** for performance optimization
- **Real API Endpoints** with proper authentication
- **JWT Authentication** with refresh tokens
- **File Storage** with Supabase Storage
- **Email Service** with Nodemailer
- **Logging System** with Winston
- **Rate Limiting** and security middleware
- **Error Handling** with proper HTTP status codes

### ✅ **Supabase Integration**
- **PostgreSQL Database** with optimized schema
- **Real-time Subscriptions** for live updates
- **Row Level Security (RLS)** for data protection
- **Built-in Authentication** with OAuth support
- **Storage Buckets** for file management
- **Edge Functions** for serverless operations
- **Database Triggers** for automated actions

### ✅ **Advanced Features**
- **Real-time Code Collaboration** with Socket.IO
- **AI-Powered Tutoring** with OpenAI integration
- **Payment Processing** with Stripe
- **Community Features** with forums and study groups
- **Analytics & Reporting** with real data collection
- **Performance Optimization** with caching and CDN
- **Security Implementation** with comprehensive protection

## 🛠 **Technology Stack**

### **Backend**
- **Node.js** with Express.js framework
- **Supabase** for database, auth, and real-time features
- **Redis** for caching and sessions
- **Socket.IO** for real-time features
- **JWT** for authentication
- **Stripe** for payments
- **OpenAI** for AI features
- **Nodemailer** for email services
- **Winston** for logging

### **Database (Supabase)**
- **PostgreSQL** with optimized schema
- **Row Level Security (RLS)** for data protection
- **Real-time Subscriptions** for live updates
- **Database Triggers** for automated actions
- **Full-text Search** capabilities
- **JSONB Support** for flexible data storage

## 🚀 **Quick Start**

### **1. Supabase Setup**

1. **Create a Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create a new project
   # Note down your project URL and API keys
   ```

2. **Run Database Schema**
   ```sql
   -- Copy and paste the contents of scripts/supabase-schema.sql
   -- into your Supabase SQL editor and run it
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your Supabase credentials
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

### **2. Backend Setup**

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Edit .env file with all your API keys
   # See env.example for all required variables
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### **3. Frontend Integration**

The frontend is already configured to connect to the backend. Just start the frontend:

```bash
cd ../
npm run dev
```

## 📁 **Project Structure**

```
backend/
├── config/
│   └── supabase.js          # Supabase client configuration
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── payments.js          # Stripe payment integration
│   ├── aiTutor.js           # OpenAI AI tutor integration
│   └── ...                  # Other route files
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── ...                  # Other middleware
├── socket/
│   └── handlers.js          # Real-time Socket.IO handlers
├── scripts/
│   └── supabase-schema.sql  # Database schema
├── server.js                # Main Express server
├── package.json             # Dependencies
└── env.example              # Environment variables template
```

## 🔧 **Environment Configuration**

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🗄 **Database Schema**

The Supabase database includes the following tables:

### **Core Tables**
- `users` - User profiles and authentication
- `user_progress` - Learning progress tracking
- `user_preferences` - User settings and preferences
- `user_subscriptions` - Subscription management

### **Content Tables**
- `courses` - Course catalog
- `modules` - Course modules
- `topics` - Learning topics
- `code_examples` - Code examples
- `exercises` - Practice exercises

### **Community Tables**
- `posts` - Community forum posts
- `post_likes` - Post likes
- `post_replies` - Post replies
- `study_groups` - Study groups
- `study_group_members` - Group membership
- `mentorship_sessions` - Mentorship bookings

### **Analytics Tables**
- `code_executions` - Code execution history
- `ai_conversations` - AI tutor conversations
- `analytics_events` - User analytics

## 🔒 **Security Features**

### **Row Level Security (RLS)**
- All tables have RLS enabled
- Users can only access their own data
- Public content is viewable by everyone
- Admin users have elevated permissions

### **Authentication**
- JWT tokens for API authentication
- Password hashing with bcrypt
- Email verification system
- Password reset functionality
- OAuth integration (Google, Facebook, GitHub)

### **API Security**
- Rate limiting to prevent abuse
- Input validation with express-validator
- CORS configuration
- Helmet.js for security headers
- Request logging and monitoring

## 📊 **Real-time Features**

### **Socket.IO Integration**
- Real-time code collaboration
- Live chat in study groups
- User presence indicators
- Cursor tracking for collaborative editing
- Screen sharing capabilities

### **Supabase Real-time**
- Database change notifications
- Live updates for community posts
- Real-time progress tracking
- Instant notifications

## 🧪 **Testing**

```bash
# Run backend tests
npm test

# Run specific test suites
npm test -- --grep "auth"
npm test -- --grep "payments"
```

## 🚀 **Deployment**

### **Production Build**
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### **Environment Variables**
Ensure all production environment variables are properly configured:
- Supabase project URL and API keys
- Stripe production keys
- OpenAI API key
- Email service credentials
- Security secrets and tokens

### **Supabase Production Setup**
1. Create a production Supabase project
2. Run the database schema
3. Configure RLS policies
4. Set up storage buckets
5. Configure authentication providers

## 📈 **Monitoring & Analytics**

- **Application Logging** with Winston
- **Error Tracking** with automated reporting
- **Performance Monitoring** with real-time metrics
- **User Analytics** with privacy-compliant tracking
- **Database Monitoring** through Supabase dashboard

## 🔧 **Development Workflow**

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Database Changes**
   - Update `scripts/supabase-schema.sql`
   - Run in Supabase SQL editor
   - Test locally

3. **API Development**
   - Add new routes in `routes/` directory
   - Update middleware as needed
   - Test with Postman or similar

4. **Real-time Features**
   - Update Socket.IO handlers in `socket/handlers.js`
   - Test real-time functionality

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Check the Supabase documentation
- Review the API documentation
- Create an issue in the repository
- Contact the development team

---

**🎉 Your CodeAcademy Pro backend is now powered by Supabase!** 