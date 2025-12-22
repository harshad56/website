const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { db } = require('../config/supabase');
const winston = require('winston');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            winston.warn('No token provided for authenticated route:', req.path);
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Get user from database
        let user;
        try {
            user = await db.getUserById(decoded.id);
        } catch (dbError) {
            winston.error('Database error fetching user:', dbError);
            // In development, allow request to continue if Supabase is not configured
            if (process.env.NODE_ENV !== 'production' && dbError.message?.includes('Supabase not configured')) {
                winston.warn('Supabase not configured, allowing request in development mode');
                const devEmail = decoded.email || 'dev@example.com';
                const isAuthorizedAdmin = devEmail.toLowerCase() === 'harshadbagal77@gmail.com';

                // Create a mock user for development
                req.user = {
                    id: decoded.id || 'dev-user-id',
                    email: devEmail,
                    name: decoded.name || 'Dev User',
                    role: isAuthorizedAdmin ? 'admin' : 'user',
                    is_active: true
                };
                return next();
            }
            throw dbError;
        }

        if (!user) {
            winston.warn('User not found:', decoded.id);
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        winston.error('Authentication error:', {
            error: error.message,
            name: error.name,
            stack: error.stack
        });

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRole = req.user.role;
        const userEmail = req.user.email?.toLowerCase();
        const authorizedAdminEmail = 'harshadbagal77@gmail.com';

        // Strict check: If admin role is required, verify email matches exact authorized admin
        if (roles.includes('admin')) {
            if (userRole !== 'admin' || userEmail !== authorizedAdminEmail) {
                return res.status(403).json({
                    success: false,
                    message: 'Insufficient permissions: Admin access restricted'
                });
            }
        } else if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await db.getUserById(decoded.id);

            if (user && user.is_active) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Don't fail for optional auth
        next();
    }
};

// Check if user has active subscription
const requireSubscription = (plan = 'free') => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // For now, allow all users (subscription check to be implemented)
            next();
        } catch (error) {
            winston.error('Subscription check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Subscription check failed'
            });
        }
    };
};

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Specific rate limiters
const authRateLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    1000, // 5 requests per window
    'Too many authentication attempts, please try again later.'
);

const codeExecutionRateLimiter = createRateLimiter(
    60 * 1000, // 1 minute
    10, // 10 requests per window
    'Too many code execution requests, please try again later.'
);

const apiRateLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per window
    'Too many API requests, please try again later.'
);

module.exports = {
    authenticateToken,
    authorize,
    optionalAuth,
    requireSubscription,
    authRateLimiter,
    codeExecutionRateLimiter,
    apiRateLimiter
};