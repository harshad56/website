const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Redis = require('redis');
const winston = require('winston');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const codeExecutionRoutes = require('./routes/codeExecution');
const communityRoutes = require('./routes/community');
const paymentRoutes = require('./routes/payments');
const aiTutorRoutes = require('./routes/aiTutor');
const analyticsRoutes = require('./routes/analytics');
const fileRoutes = require('./routes/files');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

// Import Supabase configuration
const { testConnection } = require('./config/supabase');

// Import socket handlers
const socketHandlers = require('./socket/handlers');

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

// Initialize Redis (optional for development)
let redisClient = null;
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
    redisClient = Redis.createClient({
        url: process.env.REDIS_URL
    });
}

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'codeacademy-pro-backend' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
app.use('/api/', limiter);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: 'Connected to Supabase',
        message: 'Real database server running successfully!'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/code-execution', codeExecutionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai-tutor', aiTutorRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/users', authenticateToken, fileRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    if (socketHandlers) {
        socketHandlers(io, socket);
    }

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try {
        console.log('🚀 Starting CodeAcademy Pro Backend with REAL DATABASE...');

        // Check if required environment variables are set
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('❌ Missing required environment variables:');
            console.error('   - SUPABASE_URL');
            console.error('   - SUPABASE_SERVICE_ROLE_KEY');
            console.error('');
            console.error('📝 Please create a .env file with your Supabase credentials.');
            console.error('   You can copy from env.example and fill in your values.');
            console.error('');
            console.error('🔗 Get your Supabase credentials from: https://supabase.com');
            process.exit(1);
        }

        // Test Supabase connection
        console.log('🔌 Testing database connection...');
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ Failed to connect to Supabase database');
            console.error('   Please check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
            process.exit(1);
        }

        console.log('✅ Database connection successful!');

        // Connect to Redis if configured
        if (redisClient) {
            await redisClient.connect();
            logger.info('Connected to Redis');
            console.log('✅ Redis connected');
        } else {
            console.log('⚠️  Redis connection skipped (not configured)');
        }

        // Start server
        server.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
            console.log(`🚀 CodeAcademy Pro Backend running on port ${PORT}`);
            console.log(`📱 Frontend should be accessible at: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
            console.log(`🔧 Backend API available at: http://localhost:${PORT}/api`);
            console.log(`💚 Health check: http://localhost:${PORT}/health`);
            console.log(`🗄️  Database: Supabase (Real data storage)`);
            console.log(`🔌 Socket.IO ready for real-time connections`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    if (redisClient) {
        redisClient.quit();
    }
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    if (redisClient) {
        redisClient.quit();
    }
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

startServer();

module.exports = app;