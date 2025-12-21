const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

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
            format: winston.format.simple()
        })
    ]
});

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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Rate limiting
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'CodeAcademy Pro Backend',
        version: '1.0.0'
    });
});

// Mock authentication middleware for testing
const mockAuth = (req, res, next) => {
    req.user = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        preferences: {
            preferredLanguage: 'javascript',
            difficulty: 'intermediate'
        },
        progress: {
            completedModules: ['basics', 'functions'],
            totalPoints: 150,
            currentStreak: 5
        }
    };
    next();
};

// AI Tutor endpoints for testing
app.post('/api/ai/chat', mockAuth, async(req, res) => {
    try {
        const { message, context, language, code } = req.body;
        const user = req.user;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Mock AI response for testing
        const mockResponse = {
            text: `Hello! I'm your AI programming tutor. You asked: "${message}". This is a mock response for testing purposes.`,
            code: code ? `// Here's some example code for ${language || 'javascript'}:\nconsole.log("Hello, World!");` : null,
            suggestions: [
                'Try breaking down your problem into smaller parts',
                'Consider using console.log() for debugging',
                'Check the documentation for best practices'
            ],
            language: language || 'javascript'
        };

        res.json({
            success: true,
            response: mockResponse,
            usage: {
                prompt_tokens: 50,
                completion_tokens: 100,
                total_tokens: 150
            }
        });

    } catch (error) {
        logger.error('AI Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get AI response'
        });
    }
});

app.post('/api/ai/analyze-code', mockAuth, async(req, res) => {
    try {
        const { code, language, task } = req.body;
        const user = req.user;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Code and language are required'
            });
        }

        // Mock code analysis response
        const mockAnalysis = {
            quality: 'Good',
            improvements: [
                'Consider adding comments to explain complex logic',
                'Use more descriptive variable names',
                'Add error handling where appropriate'
            ],
            bestPractices: [
                'Follow consistent naming conventions',
                'Keep functions small and focused',
                'Use meaningful variable names'
            ],
            security: language === 'javascript' ? [
                'Avoid using eval()',
                'Sanitize user inputs',
                'Use HTTPS for data transmission'
            ] : [],
            performance: [
                'Consider time complexity of algorithms',
                'Use appropriate data structures',
                'Avoid unnecessary computations'
            ],
            examples: [{
                title: 'Improved version',
                code: code.replace(/console\.log/g, '// Improved: console.log')
            }]
        };

        res.json({
            success: true,
            analysis: mockAnalysis,
            rawAnalysis: JSON.stringify(mockAnalysis, null, 2),
            usage: {
                prompt_tokens: 100,
                completion_tokens: 200,
                total_tokens: 300
            }
        });

    } catch (error) {
        logger.error('Code Analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze code'
        });
    }
});

app.post('/api/ai/recommendations', mockAuth, async(req, res) => {
    try {
        const { language, topic } = req.body;
        const user = req.user;

        // Mock learning recommendations
        const mockRecommendations = {
            nextTopics: [{
                    title: 'Advanced Functions',
                    description: 'Learn about closures, callbacks, and higher-order functions',
                    difficulty: 'intermediate',
                    estimatedTime: '2-3 hours'
                },
                {
                    title: 'Object-Oriented Programming',
                    description: 'Master classes, inheritance, and polymorphism',
                    difficulty: 'intermediate',
                    estimatedTime: '4-5 hours'
                }
            ],
            practiceExercises: [{
                    title: 'Array Manipulation',
                    description: 'Practice with map, filter, and reduce methods',
                    difficulty: 'beginner',
                    estimatedTime: '1 hour'
                },
                {
                    title: 'Async Programming',
                    description: 'Work with promises and async/await',
                    difficulty: 'intermediate',
                    estimatedTime: '2 hours'
                }
            ],
            projects: [{
                    title: 'Todo App',
                    description: 'Build a full-stack todo application',
                    difficulty: 'intermediate',
                    estimatedTime: '8-10 hours'
                },
                {
                    title: 'Weather Dashboard',
                    description: 'Create a weather app using APIs',
                    difficulty: 'beginner',
                    estimatedTime: '4-6 hours'
                }
            ],
            resources: [{
                    title: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org/',
                    type: 'documentation'
                },
                {
                    title: 'Eloquent JavaScript',
                    url: 'https://eloquentjavascript.net/',
                    type: 'book'
                }
            ]
        };

        res.json({
            success: true,
            recommendations: mockRecommendations,
            usage: {
                prompt_tokens: 75,
                completion_tokens: 150,
                total_tokens: 225
            }
        });

    } catch (error) {
        logger.error('Recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations'
        });
    }
});

// Mock courses endpoint
app.get('/api/courses', (req, res) => {
    const mockCourses = [{
            id: '1',
            title: 'JavaScript Fundamentals',
            description: 'Learn the basics of JavaScript programming',
            language: 'javascript',
            difficulty: 'beginner',
            duration: '10 hours',
            modules: 5,
            topics: 20
        },
        {
            id: '2',
            title: 'Python for Beginners',
            description: 'Start your Python programming journey',
            language: 'python',
            difficulty: 'beginner',
            duration: '12 hours',
            modules: 6,
            topics: 25
        }
    ];

    res.json({
        success: true,
        courses: mockCourses
    });
});

// Mock community posts endpoint
app.get('/api/community/posts', (req, res) => {
    const mockPosts = [{
            id: '1',
            title: 'Best practices for React hooks?',
            content: 'I\'m learning React hooks and would love some tips...',
            author: { name: 'John Doe', avatar: null },
            category: 'discussion',
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Python vs JavaScript for beginners',
            content: 'Which language should I learn first?',
            author: { name: 'Jane Smith', avatar: null },
            category: 'discussion',
            created_at: new Date().toISOString()
        }
    ];

    res.json({
        success: true,
        posts: mockPosts
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    logger.info('Client connected:', socket.id);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        logger.info(`Client ${socket.id} joined room ${roomId}`);
    });

    socket.on('code-change', (data) => {
        socket.to(data.roomId).emit('code-update', data);
    });

    socket.on('disconnect', () => {
        logger.info('Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`🚀 Test server running on port ${PORT}`);
    logger.info(`📡 Health check: http://localhost:${PORT}/health`);
    logger.info(`🤖 AI endpoints available at /api/ai/*`);
});

module.exports = { app, server, io };