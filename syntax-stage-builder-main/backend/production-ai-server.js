const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
const OpenAI = require('openai');
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

// Initialize OpenAI (will use mock if no API key)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-mock-openai-api-key') {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    console.log('🤖 OpenAI API initialized with real key');
} else {
    console.log('🤖 Using mock OpenAI responses (set OPENAI_API_KEY for real AI)');
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
        version: '1.0.0',
        aiStatus: openai ? 'Real OpenAI API' : 'Mock AI Responses'
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

// Real AI Chat with OpenAI integration
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

        let aiResponse;
        let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

        if (openai) {
            // Real OpenAI API call
            const systemPrompt = `You are an expert programming tutor specializing in ${language || 'programming'}. 
            The user is at ${user.preferences.difficulty} level. 
            Provide clear, educational responses with code examples when appropriate.`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                max_tokens: 1000,
                temperature: 0.7,
                stream: false
            });

            aiResponse = {
                text: completion.choices[0].message.content,
                code: null,
                suggestions: [
                    'Try breaking down your problem into smaller parts',
                    'Consider using console.log() for debugging',
                    'Check the documentation for best practices'
                ],
                language: language || 'javascript'
            };

            usage = completion.usage;
        } else {
            // Mock response
            aiResponse = {
                text: `Hello! I'm your AI programming tutor. You asked: "${message}". This is a mock response for testing purposes.`,
                code: code ? `// Here's some example code for ${language || 'javascript'}:\nconsole.log("Hello, World!");` : null,
                suggestions: [
                    'Try breaking down your problem into smaller parts',
                    'Consider using console.log() for debugging',
                    'Check the documentation for best practices'
                ],
                language: language || 'javascript'
            };
        }

        res.json({
            success: true,
            response: aiResponse,
            usage: usage
        });

    } catch (error) {
        logger.error('AI Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get AI response',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Real Code Analysis with OpenAI
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

        let analysis;
        let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

        if (openai) {
            // Real OpenAI API call
            const analysisPrompt = `
You are an expert programming tutor. Analyze the following ${language} code and provide detailed feedback.

Code:
\`\`\`${language}
${code}
\`\`\`

Task: ${task || 'General code review'}

Please provide a JSON response with the following structure:
{
  "quality": "Good/Bad/Average",
  "improvements": ["array of improvement suggestions"],
  "bestPractices": ["array of best practices"],
  "security": ["array of security considerations"],
  "performance": ["array of performance tips"],
  "examples": [{"title": "string", "code": "string"}]
}

Make your analysis suitable for a ${user.preferences.difficulty} level programmer.
`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an expert programming tutor specializing in code analysis and improvement suggestions." },
                    { role: "user", content: analysisPrompt }
                ],
                max_tokens: 1500,
                temperature: 0.3,
                stream: false
            });

            try {
                analysis = JSON.parse(completion.choices[0].message.content);
            } catch (parseError) {
                analysis = {
                    quality: 'Good',
                    improvements: ['Code analysis completed'],
                    bestPractices: ['Follow coding standards'],
                    security: ['Consider security implications'],
                    performance: ['Optimize for performance'],
                    examples: [{ title: 'Analysis', code: completion.choices[0].message.content }]
                };
            }

            usage = completion.usage;
        } else {
            // Mock analysis
            analysis = {
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
        }

        res.json({
            success: true,
            analysis: analysis,
            rawAnalysis: JSON.stringify(analysis, null, 2),
            usage: usage
        });

    } catch (error) {
        logger.error('Code Analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze code',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Real Learning Recommendations with OpenAI
app.post('/api/ai/recommendations', mockAuth, async(req, res) => {
    try {
        const { language, topic } = req.body;
        const user = req.user;

        let recommendations;
        let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

        if (openai) {
            // Real OpenAI API call
            const recommendationPrompt = `
Based on the user's profile, generate personalized learning recommendations.

User Profile:
- Name: ${user.name}
- Preferred Language: ${user.preferences.preferredLanguage}
- Difficulty Level: ${user.preferences.difficulty}
- Completed Modules: ${user.progress.completedModules.length}
- Total Points: ${user.progress.totalPoints}
- Current Streak: ${user.progress.currentStreak} days

Current Request:
- Language: ${language || user.preferences.preferredLanguage}
- Topic: ${topic || 'general'}

Generate a JSON response with the following structure:
{
  "nextTopics": [{"title": "string", "description": "string", "difficulty": "string", "estimatedTime": "string"}],
  "practiceExercises": [{"title": "string", "description": "string", "difficulty": "string", "estimatedTime": "string"}],
  "projects": [{"title": "string", "description": "string", "difficulty": "string", "estimatedTime": "string"}],
  "resources": [{"title": "string", "url": "string", "type": "string"}]
}
`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an expert programming education advisor. Provide structured, personalized learning recommendations." },
                    { role: "user", content: recommendationPrompt }
                ],
                max_tokens: 1000,
                temperature: 0.5,
                stream: false
            });

            try {
                recommendations = JSON.parse(completion.choices[0].message.content);
            } catch (parseError) {
                recommendations = {
                    nextTopics: [{ title: 'Continue Learning', description: 'Keep progressing', difficulty: 'intermediate', estimatedTime: '2-3 hours' }],
                    practiceExercises: [{ title: 'Practice', description: 'Regular practice', difficulty: 'beginner', estimatedTime: '1 hour' }],
                    projects: [{ title: 'Build Something', description: 'Apply your knowledge', difficulty: 'intermediate', estimatedTime: '4-6 hours' }],
                    resources: [{ title: 'Documentation', url: 'https://developer.mozilla.org/', type: 'documentation' }]
                };
            }

            usage = completion.usage;
        } else {
            // Mock recommendations
            recommendations = {
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
        }

        res.json({
            success: true,
            recommendations: recommendations,
            usage: usage
        });

    } catch (error) {
        logger.error('Recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    logger.info(`🚀 Production AI server running on port ${PORT}`);
    logger.info(`📡 Health check: http://localhost:${PORT}/health`);
    logger.info(`🤖 AI endpoints available at /api/ai/*`);
    logger.info(`🔧 AI Status: ${openai ? 'Real OpenAI API' : 'Mock AI Responses'}`);
    logger.info(`📝 To enable real AI: Set OPENAI_API_KEY in your .env file`);
});

module.exports = { app, server, io };