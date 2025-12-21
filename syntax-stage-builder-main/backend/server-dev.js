const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');

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

// Basic middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for development
}));

app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: 'development',
        message: 'Development server running successfully!'
    });
});

// Basic API test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend API is working!',
        timestamp: new Date().toISOString()
    });
});

// Try to load routes with error handling
const loadRoutes = () => {
    const routes = {};

    try {
        // Try to load auth routes
        try {
            routes.auth = require('./routes/auth');
            app.use('/api/auth', routes.auth);
            console.log('✅ Auth routes loaded');
        } catch (error) {
            console.log('⚠️  Auth routes failed to load:', error.message);
        }

        // Try to load user routes
        try {
            routes.users = require('./routes/users');
            app.use('/api/users', routes.users);
            console.log('✅ User routes loaded');
        } catch (error) {
            console.log('⚠️  User routes failed to load:', error.message);
        }

        // Try to load course routes
        try {
            routes.courses = require('./routes/courses');
            app.use('/api/courses', routes.courses);
            console.log('✅ Course routes loaded');
        } catch (error) {
            console.log('⚠️  Course routes failed to load:', error.message);
        }

        // Try to load other routes
        const otherRoutes = [
            { name: 'codeExecution', path: './routes/codeExecution' },
            { name: 'community', path: './routes/community' },
            { name: 'payments', path: './routes/payments' },
            { name: 'aiTutor', path: './routes/aiTutor' },
            { name: 'analytics', path: './routes/analytics' },
            { name: 'files', path: './routes/files' }
        ];

        otherRoutes.forEach(route => {
            try {
                routes[route.name] = require(route.path);
                app.use(`/api/${route.name}`, routes[route.name]);
                console.log(`✅ ${route.name} routes loaded`);
            } catch (error) {
                console.log(`⚠️  ${route.name} routes failed to load:`, error.message);
            }
        });

    } catch (error) {
        console.log('⚠️  Some routes failed to load, but server will continue');
    }
};

// Load routes
loadRoutes();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        availableEndpoints: [
            '/health',
            '/api/test',
            '/api/auth/*',
            '/api/users/*',
            '/api/courses/*'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try {
        console.log('🚀 Starting CodeAcademy Pro Backend in DEVELOPMENT mode...');
        console.log('⚠️  Database connection check skipped for development');

        // Start server
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 CodeAcademy Pro Backend (DEV) running on port ${PORT}`);
            console.log(`📱 Frontend should be accessible at: http://localhost:8080`);
            console.log(`🔧 Backend API available at: http://localhost:${PORT}/api`);
            console.log(`💚 Health check: http://localhost:${PORT}/health`);
            console.log(`🧪 API test: http://localhost:${PORT}/api/test`);
            console.log(`🔌 Socket.IO ready for real-time connections`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
    });
});

startServer();

module.exports = app;