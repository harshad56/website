const express = require('express');
const { body, validationResult } = require('express-validator');
const { db, supabase } = require('../config/supabase');
const { authRateLimiter, authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const passport = require('passport');
const winston = require('winston');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Validation middleware
const validateSignup = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const validatePasswordReset = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email')
];

const validatePasswordUpdate = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    },
        process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateSignup, handleValidationErrors, authRateLimiter, async (req, res) => {
    try {
        const { name, password } = req.body;
        // Explicitly lowercase email to ensure consistency
        const email = req.body.email.toLowerCase();

        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists with this email id, please use another one.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = uuidv4();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user
        const userData = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            email_verified: false,
            email_verification_token: verificationToken,
            email_verification_expires: verificationExpires,
            role: 'student',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        };

        try {
            const user = await db.createUser(userData);

            // Send verification email
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
            await sendEmail({
                to: user.email,
                subject: 'Verify your email address',
                template: 'emailVerification',
                data: {
                    name: user.name,
                    verificationUrl
                }
            });

            // Generate JWT token
            const token = generateToken(user);

            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email to verify your account.',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        emailVerified: user.email_verified,
                        role: user.role
                    },
                    token
                }
            });
        } catch (dbError) {
            // Handle unique constraint violation (code 23505 in Postgres)
            if (dbError.code === '23505' || (dbError.message && dbError.message.includes('unique'))) {
                return res.status(400).json({
                    success: false,
                    message: 'Account already exists with this email id, please use another one.'
                });
            }
            throw dbError;
        }

    } catch (error) {
        winston.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, authRateLimiter, async (req, res) => {
    try {
        const { password } = req.body;
        // Explicitly lowercase email
        const email = req.body.email.toLowerCase();

        // Find user by email
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await db.updateUser(user.id, { last_login: new Date() });

        // Generate JWT token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.email_verified,
                    role: user.role,
                    avatar: user.avatar,
                    progress: user.progress,
                    preferences: user.preferences,
                    subscription: user.subscription
                },
                token
            }
        });

    } catch (error) {
        winston.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        // Find user with verification token
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email_verification_token', token)
            .gt('email_verification_expires', new Date().toISOString())
            .limit(1);

        if (error || !users || users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        const user = users[0];

        // Mark email as verified
        await db.updateUser(user.id, {
            email_verified: true,
            email_verification_token: null,
            email_verification_expires: null
        });

        res.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        winston.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Email verification failed'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', validatePasswordReset, handleValidationErrors, authRateLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await db.getUserByEmail(email);
        if (!user) {
            // Don't reveal if user exists or not
            return res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent'
            });
        }

        // Generate password reset token
        const resetToken = uuidv4();
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.updateUser(user.id, {
            password_reset_token: resetToken,
            password_reset_expires: resetExpires
        });

        // Send password reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Reset your password',
            template: 'passwordReset',
            data: {
                name: user.name,
                resetUrl
            }
        });

        res.json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent'
        });

    } catch (error) {
        winston.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send password reset email'
        });
    }
});

// @route   POST /api/auth/change-password
// @desc    Change password for logged in user
// @access  Private
router.post('/change-password', authenticateToken, validateChangePassword, handleValidationErrors, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get fresh user data including password hash
        const user = await db.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect current password'
            });
        }

        // Prevent reusing the same password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as your current password'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await db.updateUser(userId, {
            password: hashedPassword,
            updated_at: new Date()
        });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        winston.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validatePasswordUpdate, handleValidationErrors, async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Reset token is required'
            });
        }

        // Find user with reset token
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('password_reset_token', token)
            .gt('password_reset_expires', new Date().toISOString())
            .limit(1);

        if (error || !users || users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        const user = users[0];

        // Check if new password is same as old password
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as your old password. Please choose a different one.'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password
        await db.updateUser(user.id, {
            password: hashedPassword,
            password_reset_token: null,
            password_reset_expires: null
        });

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        winston.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed'
        });
    }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post('/resend-verification', validatePasswordReset, handleValidationErrors, authRateLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.email_verified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = uuidv4();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await db.updateUser(user.id, {
            email_verification_token: verificationToken,
            email_verification_expires: verificationExpires
        });

        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Verify your email address',
            template: 'emailVerification',
            data: {
                name: user.name,
                verificationUrl
            }
        });

        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        winston.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification email'
        });
    }
});

// OAuth Routes
// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
    accessType: 'online'
}));

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

// @route   GET /api/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));

// @route   GET /api/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

// @route   GET /api/auth/github
// @desc    GitHub OAuth login
// @access  Public
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
// @access  Public
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

module.exports = router;