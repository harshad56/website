const express = require('express');
const path = require('path');
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
const courseContentRoutes = require('./routes/courseContent');
const codeExecutionRoutes = require('./routes/codeExecution');
const communityRoutes = require('./routes/community');
const paymentRoutes = require('./routes/payments');
const projectRoutes = require('./routes/projects');
const studyMaterialRoutes = require('./routes/studyMaterials');
const jobRoutes = require('./routes/jobs');
const aiTutorRoutes = require('./routes/aiTutor');
const resumeAIRoutes = require('./routes/resumeAI');
const interviewPracticeRoutes = require('./routes/interviewPractice');
const analyticsRoutes = require('./routes/analytics');
const fileRoutes = require('./routes/files');
const wishlistRoutes = require('./routes/wishlist');
const languagesRoutes = require('./routes/languages');

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

// Configure Passport strategies
require('./config/passport')();

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }
});

// Initialize Redis (optional for development and production)
let redisClient = null;
const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
    winston.info('Initializing Redis client...');
    redisClient = Redis.createClient({
        url: redisUrl
    });

    redisClient.on('error', (err) => winston.warn('Redis Client Error', err));
} else {
    winston.warn('REDIS_URL not found, Redis disabled');
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
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Add file transports only if we have write access (usually dev)
if (process.env.NODE_ENV !== 'production') {
    try {
        logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
        logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
    } catch (e) {
        console.warn('Could not initialize file logging:', e.message);
    }
}

// Rate limiting - More lenient in development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production'
        ? (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100)
        : (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000), // Much higher limit in development
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        if (req.path === '/health') return true;
        // Skip rate limiting in development if DISABLE_RATE_LIMIT is set
        if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_RATE_LIMIT === 'true') {
            return true;
        }
        return false;
    }
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

// Compression middleware - optimize for performance
app.use(compression({
    level: 6, // Compression level (1-9, 6 is good balance)
    filter: (req, res) => {
        // Don't compress if client doesn't support it
        if (req.headers['x-no-compression']) {
            return false;
        }
        // Use compression for all text-based responses
        return compression.filter(req, res);
    },
    threshold: 1024, // Only compress responses > 1KB
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Handle OPTIONS requests for uploads (CORS preflight)
app.options('/uploads/*', (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.sendStatus(200);
});

// Static file serving for uploads (documents, etc.)
// Set proper headers for file downloads and CORS
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        // Add CORS headers for all static files
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        res.setHeader('Access-Control-Allow-Origin', frontendUrl);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        // Force download for certain file types
        if (filePath.endsWith('.zip') || filePath.endsWith('.pdf') || filePath.endsWith('.rar')) {
            const filename = path.basename(filePath);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        }
    }
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
app.use('/api/', limiter);

// Request logging
app.use(requestLogger);

app.use((req, res, next) => {
    // Cache static assets for 1 year
    if (req.path.startsWith('/assets/') || req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    // No-cache for API responses to prevent account/data crossover
    else if (req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
    }
    // No cache for HTML
    else if (req.path.endsWith('.html') || req.path === '/') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

// Explicit no-cache middleware for sensitive routes
const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/auth', noCache, authRoutes);
app.use('/api/users', noCache, authenticateToken, userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', courseContentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/code-execution', codeExecutionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai-tutor', aiTutorRoutes);
app.use('/api/resume-ai', resumeAIRoutes);
app.use('/api/interview-practice', interviewPracticeRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/files', authenticateToken, fileRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/languages', languagesRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
    socketHandlers(io, socket);
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

const startServer = async () => {
    try {
        // Test Supabase connection
        const isConnected = await testConnection();
        if (!isConnected && process.env.NODE_ENV === 'production') {
            logger.error('Failed to connect to Supabase');
            process.exit(1);
        } else if (!isConnected) {
            logger.warn('Supabase connection failed, but continuing in development mode');
        }

        // Connect to Redis
        if (redisClient) {
            try {
                await redisClient.connect();
                logger.info('Connected to Redis');
            } catch (err) {
                logger.warn('Failed to connect to Redis, continuing without caching:', err.message);
                // Don't kill the server if Redis fails, just disable it
                redisClient = null;
            }
        } else {
            logger.warn('Redis connection skipped (REDIS_URL not set)');
        }

        // Start server
        server.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
            console.log(`🚀 CodeAcademy Pro Backend running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
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