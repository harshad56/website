const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

// Basic middleware
app.use(cors({
    origin: "http://localhost:8080",
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
        message: 'Minimal development server running successfully!'
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

// Mock endpoints for development
app.get('/api/auth/status', (req, res) => {
    res.json({
        success: true,
        message: 'Auth service available (mock)',
        features: ['login', 'register', 'password-reset']
    });
});

app.get('/api/courses', (req, res) => {
    res.json({
        success: true,
        message: 'Courses service available (mock)',
        courses: [
            { id: 1, title: 'JavaScript Basics', level: 'beginner' },
            { id: 2, title: 'React Fundamentals', level: 'intermediate' },
            { id: 3, title: 'Node.js Backend', level: 'advanced' }
        ]
    });
});

app.get('/api/users/profile', (req, res) => {
    res.json({
        success: true,
        message: 'User service available (mock)',
        user: {
            id: 1,
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'student'
        }
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Send welcome message
    socket.emit('welcome', {
        message: 'Welcome to CodeAcademy Pro!',
        timestamp: new Date().toISOString()
    });

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
            '/api/auth/status',
            '/api/courses',
            '/api/users/profile'
        ]
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'Something went wrong'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async() => {
    try {
        console.log('🚀 Starting CodeAcademy Pro Backend (MINIMAL) in DEVELOPMENT mode...');
        console.log('⚠️  This is a minimal server for development - no database required');

        // Start server
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 CodeAcademy Pro Backend (MINIMAL) running on port ${PORT}`);
            console.log(`📱 Frontend should be accessible at: http://localhost:8080`);
            console.log(`🔧 Backend API available at: http://localhost:${PORT}/api`);
            console.log(`💚 Health check: http://localhost:${PORT}/health`);
            console.log(`🧪 API test: http://localhost:${PORT}/api/test`);
            console.log(`🔌 Socket.IO ready for real-time connections`);
            console.log(`📚 Mock data available at: /api/courses, /api/users/profile`);
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